import { insert, update } from "./write";
import { findOne } from "./read";

(
    async () => {
        insert({ id: 1, name: "Subham" });
        insert({ id: 2, name: "Rahul" });
        insert({ id: 3, name: "Amit" });

        const user = await findOne((u) => u.id == 1);
        console.log("Found User :", user);

        await update(
            (u) => u.id == 2,
            (u) => ({ ...u, name: "2 Updated" })
        );

        const updatedUser = await findOne((user) => user.id === 2);
        console.log("🚀 ~ updatedUser:", updatedUser)
    }
)
