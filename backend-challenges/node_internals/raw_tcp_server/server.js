import net from "net";

const server = net.createServer((socket) => {
    console.log("Client connected:", socket.remoteAddress, socket.remotePort);

    // buffer to handle chunked data
    let buffer = "";

    socket.on("data", (data) => {
        buffer += data.toString("utf-8");

        // process complete messages
        let parts = buffer.split("\n");

        // keep last incomplete part in buffer
        buffer = parts.pop();

        for (let msg of parts) {
            if (!msg.trim()) continue;

            console.log("Received:", msg);

            const reversed = msg.split("").reverse().join("");

            // send response with newline (protocol consistency)
            socket.write(reversed + "\n");
        }
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (err) => {
        console.error("Socket error:", err.message);
    });
});

server.on("error", (err) => {
    console.error("Server error:", err.message);
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Server listening on port 3000");
});