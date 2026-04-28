// =====================
// EMBED BOT (CLEAN - NO AUTHOR / NO FOOTER)
// =====================
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// =====================
// READY
// =====================
client.once("ready", () => {
  console.log(`[READY] Logged in as ${client.user.tag}`);
});

// =====================
// EMBED COMMAND (FINAL CLEAN)
// =====================
client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;
  if (!message.content.startsWith("!embed")) return;

  let content = message.content.slice(7).trim();

  // ✅ Detect ONE user only
  const mentionedUser = message.mentions.users.first() || message.author;

  // ✅ Remove mention text from args
  content = content.replace(/<@!?\d+>/g, "").trim();

  const args = content.split("|").map(a => a.trim());

  let color = "#480FB4";
  let title, description;
  let thumbnail, image;

  // BASE
  if (args[0]?.startsWith("#")) {
    color = args[0];
    title = args[1];
    description = args[2];
  } else {
    title = args[0];
    description = args[1];
  }

  // ✅ Variables
  if (description) {
    description = description
      .replace(/{user\.mention}/g, `<@${mentionedUser.id}>`)
      .replace(/{user\.avatar}/g, mentionedUser.displayAvatarURL({ dynamic: true, size: 1024 }));
  }

  // OPTIONS
  args.forEach(arg => {
    const lower = arg.toLowerCase();

    if (lower.startsWith("thumbnail:")) thumbnail = arg.slice(10).trim();
    if (lower.startsWith("image:")) image = arg.slice(6).trim();
  });

  if (!title || !description) {
    return message.reply("Use: !embed #color | Title | Description");
  }

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description);

  // 🖼️ THUMBNAIL (ONLY visual avatar)
  if (thumbnail) {
    if (thumbnail === "user" || thumbnail === "{user.avatar}") {
      embed.setThumbnail(mentionedUser.displayAvatarURL({ dynamic: true, size: 1024 }));
    } else {
      embed.setThumbnail(thumbnail);
    }
  }

  // 🌆 IMAGE
  if (image) embed.setImage(image);

  try {
    await message.delete().catch(() => {});
    await message.channel.send({ embeds: [embed] });
  } catch (err) {
    console.error(err);
  }
});
