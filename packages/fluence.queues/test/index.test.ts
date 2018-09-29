import SQS from "../src/SQS";

suite("SQS");
test("Instantiate", () => {
    const storage = new SQS({
        accessKeyId: "key",
        secretAccessKey: "secret"
    });
});