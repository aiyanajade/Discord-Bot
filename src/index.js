// Require the necessary discord.js classes
const { Client, Intents, WebhookClient } = require("discord.js");

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    "GUILD_MESSAGES",
    "DIRECT_MESSAGES",
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ],
  partials: ["MESSAGE", "USER", "CHANNEL", "REACTION"]
});

const data = {
  id: process.env.WEBHOOK_ID,
  token: process.env.WEBHOOK_TOKEN
};

const webhookClient = new WebhookClient(data);
const PREFIX = "$";

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "kick") {
      if (!message.member.permissions.has("KICK_MEMBERS")) {
        return message.reply("You do not have permissions to use that command");
      }
      if (args.length === 0) return message.reply("Please provide an ID");
      const member = message.guild.members.cache.get(args[0]);

      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} was kicked.`))
          .catch((err) => message.channel.send("I cannot kick that user :("));
      } else {
        message.channel.send("The member could not be found");
      }
    } else if (CMD_NAME === "ban") {
      if (!message.member.permissions.has("BAN_MEMBERS")) {
        console.log("entered");
        return message.reply("You do not have permissions to use that command");
      }
      if (args.length === 0) return message.reply("Please provide an ID");

      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send("User banned successfully");
      } catch (err) {
        console.log(err);
        message.channel.send(
          "An error occurred. Either I do not have permissions or the user was not found"
        );
      }
    } else if (CMD_NAME === "announce") {
      console.log(args);
      const msg = args.join(" ");
      console.log(msg);
      webhookClient.send(msg);
    }
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "904793411738042428") {
    switch (name) {
      case "🐶":
        member.roles.add("904419854352797758");
        break;
      case "🐱":
        member.roles.add("904756855719469097");
        break;
      case "🐭":
        member.roles.add("904757543849562122");
        break;
      default:
        break;
    }
  }
});

client.on("messageReactionRemove", async (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (reaction.message.id === "904793411738042428") {
    switch (name) {
      case "🐶":
        member.roles.remove("904419854352797758");
        break;
      case "🐱":
        member.roles.remove("904756855719469097");
        break;
      case "🐭":
        member.roles.remove("904757543849562122");
        break;
      default:
        break;
    }
  }
});
// Login to Discord with your client's token
client.login(process.env.token);
