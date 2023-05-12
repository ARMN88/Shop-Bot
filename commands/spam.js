const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spam')
		.setDescription('Control spam in your server.')
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('enable')
  			.setDescription('Enable spam filtering.'))
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('disable')
  			.setDescription('Disable spam filtering.'))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction) {
    const rules = await interaction.guild.autoModerationRules.fetch();
    
    const existsEmbed = new EmbedBuilder()
    .setDescription("Rule already exists.")
    .setColor(0xff3333);

    switch(interaction.options.getSubcommand()) {
      case 'enable':
        if(rules.some(rule => rule.name === "Spam")) return await interaction.reply({ embeds: [existsEmbed] });
        
        const creatingEmbed = new EmbedBuilder()
          .setDescription("Creating spam rule...")
          .setColor(0xf2ff3d);
      
          await interaction.reply({ embeds: [creatingEmbed] });
          
          await interaction.guild.autoModerationRules.create({
            name: "Spam",
            eventType: 1,
            triggerType: 3,
            actions: [{
              type: 1
            }],
            enabled: true
          });
      
          const createdEmbed = new EmbedBuilder()
          .setDescription("Spam rule created!")
          .setColor(0x32a83a);
          return interaction.editReply({embeds: [createdEmbed]});
        
        break;
      case 'disable':
        const existingRule = rules.find(rule => rule.name === "Spam");
        if(!existingRule) return interaction.reply({ embeds: [ new EmbedBuilder().setDescription('Cannot disable, rule does not exist.').setColor(0xf2ff3d) ] });
        
        interaction.guild.autoModerationRules.delete(existingRule);
        const deletedEmbed = new EmbedBuilder()
          .setDescription("Spam rule deleted!")
          .setColor(0x32a83a);
          return interaction.reply({embeds: [deletedEmbed]});
        break;
    }
  }
};