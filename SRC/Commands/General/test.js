module.exports = {
    name: "test",
    description: "testing command",
    execute(client, message, args, prefix, Discord) {
        message.channel.send("Sccessfully Sent Command Testing To Your Server 😎");
    }
}