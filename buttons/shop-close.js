module.exports = {
	customId: "shop-close",
	async execute(interaction) {
    interaction.channel.delete();
    return interaction.deferUpdate();
  }
}