import net from "net";

const client = net.createConnection({ port: 3000 }, () => {
    console.log("Connected to server");

    // sending multiple messages
    client.write("Hello Subu\n");
    client.write("Node JS\n");
    client.write("TCP Streams\n");
});

client.setEncoding("utf-8");

let buffer = "";

client.on("data", (data) => {
    buffer += data;

    let parts = buffer.split("\n");
    buffer = parts.pop();

    for (let msg of parts) {
        if (!msg.trim()) continue;

        console.log("Server replied:", msg);
    }
});

client.on("end", () => {
    console.log("Disconnected from server");
});

client.on("error", (err) => {
    console.error("Client error:", err.message);
});