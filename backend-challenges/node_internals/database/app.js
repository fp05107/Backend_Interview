import FileDB from "./db.js";

const fileDb = new FileDB('data.txt');

(async () => {
    fileDb.insert({ id: 1, name: "subham" });
    fileDb.insert({ id: 2, name: "root" });

    const user = await fileDb.findOne((u) => u.id === 1, 2);
    console.log("Found:", user);

    await fileDb.update(
        (u) => u.id === 2,
        (u) => ({ ...u, name: "Updated Rahul" })
    );

    await fileDb.delete((u) => u.id === 1);

})();