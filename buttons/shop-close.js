const { setTimeout } = require("node:timers");
const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
	customId: "shop-close",
	async execute(interaction) {
    
    setTimeout(async function() {
      await interaction.channel.delete();
    }, 1000);
    
    const closeTransactionEmbed = new EmbedBuilder().setDescription("Thread deleting...").setColor(Colors.Red);
    return interaction.reply({ embeds: [closeTransactionEmbed] });
  }
}