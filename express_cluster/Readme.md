Client → NGINX (Load Balancer) → [Express Server 1, Server 2, Server 3]
                                          ↓              ↓
                                    MongoDB Primary → MongoDB Replica Set
                                    (Write DB)         (Read DBs)



// Only load .env file in development (Docker injects vars in production)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Always validate required env vars on startup
const required = ["MONGO_URI"];
required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
});
```

---

## 3. How the Databases Actually Work

### The Big Picture:
```
Your App writes data         Your App reads data
       ↓                            ↓
  mongo-primary              mongo-secondary1
  (THE BOSS)          →      mongo-secondary2
  Accepts all writes         (COPIES of the boss)
  Replicates to secondaries  Read-only, synced automatically
```

### Step by Step — What happens when you POST /api/users:
```
1. Request hits NGINX
        ↓
2. NGINX routes POST → server1 (write server)
        ↓
3. server1's Mongoose sends write to mongo-primary
        ↓
4. mongo-primary writes to its disk (oplog entry created)
        ↓
5. mongo-secondary1 and mongo-secondary2 watch the oplog
   and copy the write automatically (usually within milliseconds)
        ↓
6. Response sent back to client ✓
```

### Step by Step — What happens when you GET /api/users:
```
1. Request hits NGINX
        ↓
2. NGINX load balances GET → server2 OR server3 (read servers)
        ↓
3. server2/3's Mongoose sends read to mongo-secondary1 or mongo-secondary2
   (because readPreference: "secondaryPreferred")
        ↓
4. Secondary returns data from its local copy
        ↓
5. Response sent back ✓
```

**The primary DB is now free to handle writes only — that's the whole point!**

### What is the Oplog?

The oplog (operations log) is a special MongoDB collection that records every write operation. Secondaries constantly tail this log and replay the same operations on themselves. Think of it like a git history that secondaries follow in real time.
```
mongo-primary oplog:
  [INSERT user {name: "John"}]   ← secondary1 reads this, runs same insert
  [UPDATE user {age: 26}]        ← secondary2 reads this, runs same update
  [DELETE user {_id: "abc"}]     ← both secondaries delete too
```

### What is a Replica Set Election?

If `mongo-primary` crashes:
```
1. Secondaries stop receiving oplog heartbeats
2. After 10 seconds, they call an election
3. The secondary with the most up-to-date oplog wins
4. It becomes the new primary
5. Mongoose automatically detects the new primary and reconnects
6. Your app keeps working with zero code changes









# 1. Clone/create your project structure
mkdir my-app && cd my-app

# 2. Create all files as shown above

# 3. Generate keyfile
openssl rand -base64 756 > ./mongo-init/keyfile
chmod 400 ./mongo-init/keyfile

# 4. Build and start all containers
docker-compose up --build -d

# 5. Check all containers are running
docker-compose ps

# 6. Check logs
docker-compose logs -f nginx
docker-compose logs -f server1
docker-compose logs -f mongo-primary

# 7. Test it!
# Create a user (goes to write server/primary DB)
curl -X POST http://localhost/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":25}'

# Get all users (load balanced to server2 or server3, reads from replica)
curl http://localhost/api/users

# Search users
curl "http://localhost/api/search?q=john"

# Health check
curl http://localhost/health
```

---

## Step 9: Deploy to Production (Free Tier - Oracle Cloud)

**Oracle Cloud Always Free** gives you 2 VMs with 1 OCPU + 1GB RAM each — permanently free and powerful enough for this setup.

### 9.1 Create Free Oracle Cloud Account
1. Go to [cloud.oracle.com](https://cloud.oracle.com)
2. Sign up (needs a credit card for verification, but won't charge you)
3. Choose your home region carefully — it's permanent
4. Create a **Compute Instance** → **VM.Standard.E2.1.Micro** (Always Free)
5. Choose **Ubuntu 22.04**
6. Download your SSH private key
7. Note your public IP address

### 9.2 Open Firewall Ports (Very Important!)
In Oracle Cloud Console → Networking → Virtual Cloud Network → Security Lists → Add Ingress Rules:
```
Port 22  (SSH)   - Source: 0.0.0.0/0
Port 80  (HTTP)  - Source: 0.0.0.0/0
Port 443 (HTTPS) - Source: 0.0.0.0/0