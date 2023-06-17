const {
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  Colors,
  PermissionsBitField,
} = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true,
  },
});

// Info //
const Info = require('../models/Infos.js')(database, DataTypes);
const infoTypes = ['channel', 'role', 'webhook'];

// Shops //
const Shop = require('../models/Shops.js')(database, DataTypes);
const shopTypes = ['gift-bases', 'bases', 'wood', 'accounts'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View avaliable products!')
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('gift-bases')
        .setDescription('All avaliable gift bases.')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('bases').setDescription('All avaliable bases.')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('accounts').setDescription('All avaliable accounts.')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('wood').setDescription('All avaliable wood.')
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('send')
        .setDescription('Send all the avaliable items in a group.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('gift-bases')
            .setDescription('Send all avaliable gift bases.')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('bases')
            .setDescription('Send all avaliable bases.')
        )
        .addSubcommand((subcommand) =>
          subcommand.setName('wood').setDescription('Send all avaliable wood.')
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('accounts')
            .setDescription('Send all avaliable accounts.')
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('menu')
        .setDescription('Edit, add, or remove an item from the shop.')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('add')
            .setDescription('Add an item to the shop.')
            .addStringOption((option) =>
              option
                .setName('type')
                .setDescription('Set the type of item.')
                .setRequired(true)
                .addChoices(
                  { name: 'Gift Bases', value: 'gift-bases' },
                  { name: 'Bases', value: 'bases' },
                  { name: 'Wood', value: 'wood' },
                  { name: 'Accounts', value: 'accounts' }
                )
            )
            .addStringOption((option) =>
              option
                .setName('name')
                .setDescription('Set the name of this item.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('price-robux')
                .setDescription('Set the price in robux of this item.')
                .setRequired(true)
                .setMaxValue(65535)
                .setMinValue(1)
            )
            .addNumberOption((option) =>
              option
                .setName('price-dollars')
                .setDescription('Set the price in dollars of this item.')
                .setRequired(true)
                .setMinValue(0)
            )
            .addAttachmentOption((option) =>
              option
                .setName('image')
                .setDescription('Set the image of this item.')
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName('data-size')
                .setDescription('Set the data size of this item.')
                .setRequired(false)
            )
            .addStringOption((option) =>
              option
                .setName('creator')
                .setDescription('Set the author of this build')
                .setRequired(false)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('edit')
            .setDescription('Delete or edit an item in the shop.')
            .addIntegerOption((option) =>
              option
                .setName('name')
                .setDescription('The name of this item.')
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const items = await Shop.findAll({ where: { guildId: interaction.guildId } });
    const choices = items.map(({ id, name }) => `${id} - ${name}`);

    const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
    await interaction.respond(
      filtered.map(choice => ({ name: choice, value: parseInt(choice.split(' ')[0]) })),
    );
  },
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.options.getSubcommandGroup() === 'menu') {
      if (
        !interaction.memberPermissions.has(
          PermissionsBitField.Flags.Administrator
        )
      )
        return await interaction.editReply({
          content: `Unable to edit, you do not have permission.`,
          ephemeral: true,
        });

      const menuEmbed = new EmbedBuilder()
        .setColor(Colors.Purple)
        .setTitle('Shop Editor')
        .setTimestamp();
      switch (interaction.options.getSubcommand()) {
        case 'add':
          const newItem = await Shop.create({
            guildId: interaction.guildId,
            type: shopTypes.indexOf(interaction.options.getString('type')),
            name: interaction.options.getString('name'),
            priceDollars: interaction.options.getNumber('price-dollars'),
            priceRobux: interaction.options.getInteger('price-robux'),
            attachment: interaction.options.getAttachment('image').attachment,
            dataSize: interaction.options.getInteger('data-size') || 0,
            creator: interaction.options.getString('creator') || 'Unknown'
          });

          menuEmbed
            .setDescription('Successfully added item!')
            .addFields(
              { name: 'Type', value: interaction.options.getString('type') },
              { name: 'Name', value: interaction.options.getString('name') },
              {
                name: 'Price',
                value: `\$${interaction.options
                  .getNumber('price-dollars')
                  .toFixed(2)} OR ${interaction.options.getInteger(
                    'price-robux'
                  )} RBX`,
              }
            )
            .setImage(interaction.options.getAttachment('image').attachment)
            .setFooter({ text: `Created By ${interaction.options.getString('creator') || 'Unknown'}` });
        

          if (interaction.options.getInteger('data-size')) {
            menuEmbed.addFields({
              name: 'Data Size',
              value: `${interaction.options.getInteger('data-size')}`,
            });
          }

          await interaction.editReply({
            embeds: [menuEmbed],
            ephemeral: true,
          });

          const shopChannelId = await Info.findOne({
            where: {
              guildId: interaction.guildId,
              name: interaction.options.getString('type'),
              type: infoTypes.indexOf('channel'),
            },
          });
          if (!shopChannelId) return;

          let shopChannel;
          try {
            shopChannel = await interaction.guild.channels.fetch(
              shopChannelId.identifier
            );
          } catch {
            return;
          }

          const shopNewEmbed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setThumbnail(interaction.guild.iconURL({ size: 512 }))
            .setTitle(
              `${newItem.dataValues.id} - ${interaction.options.getString(
                'name'
              )}`
            )
            .addFields(
              {
                name: 'Robux',
                value: `${interaction.options.getInteger('price-robux')}`,
              },
              {
                name: 'Dollars',
                value:
                  '$' +
                  interaction.options.getNumber('price-dollars').toFixed(2),
              }
            )
            .setImage(interaction.options.getAttachment('image').attachment)
            .setFooter({text: `Created By ${interaction.options.getString('creator') || 'Unknown'}` });

          if (interaction.options.getInteger('data-size')) {
            shopNewEmbed.addFields({
              name: 'Data Size',
              value: `${interaction.options.getInteger('data-size')}`,
            });
          }

          const externalBuyButton = new ButtonBuilder()
            .setCustomId('external-buy-button')
            .setLabel('Buy Now')
            .setStyle(ButtonStyle.Success);

          const externalRow = new ActionRowBuilder().addComponents(
            externalBuyButton
          );

          const newItemResponse = await shopChannel.send({
            embeds: [shopNewEmbed],
            components: [externalRow],
          });

          return await Shop.update({ messageId: newItemResponse.id }, { where: { id: newItem.id } });
        case 'edit':
          const item = await Shop.findOne({
            where: { id: interaction.options.getInteger('name') },
          });
          if (!item || item.guildId !== interaction.guildId) return await interaction.editReply({ embeds: [new EmbedBuilder().setDescription('Item does not exist.').setColor(Colors.Red)], ephemeral: true });

          const editButton = new ButtonBuilder()
            .setCustomId('shop-edit')
            .setLabel('Edit')
            .setStyle(ButtonStyle.Secondary);

          const deleteButton = new ButtonBuilder()
            .setCustomId('shop-delete')
            .setLabel('Delete')
            .setStyle(ButtonStyle.Danger);

          const row = new ActionRowBuilder().addComponents(
            editButton,
            deleteButton
          );

          const shopEditEmbed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setThumbnail(interaction.guild.iconURL({ size: 512 }))
            .setAuthor({
              name: shopTypes[item.type],
              iconURL: interaction.guild.iconURL(),
            })
            .setTitle(`${item.id} - ` + item.name)
            .addFields(
              { name: 'Robux', value: `${item.priceRobux}` },
              {
                name: 'Dollars',
                value: '$' + item.priceDollars.toFixed(2),
              }
            )
            .setImage(item.attachment)
            .setFooter({ text: `Created By ${item.creator}` });

          if (item.dataSize) {
            shopEditEmbed.addFields({
              name: 'Data Size',
              value: `${item.dataSize}`,
            });
          }

          return await interaction.editReply({
            embeds: [shopEditEmbed],
            components: [row],
            ephemeral: true,
          });
          break;
      }
    } else if (interaction.options.getSubcommandGroup() === 'send') {
      if (
        !interaction.memberPermissions.has(
          PermissionsBitField.Flags.Administrator
        )
      )
        return await interaction.editReply({
          content: `Unable to edit, you do not have permission.`,
          ephemeral: true,
        });
      const items = await Shop.findAll({
        where: {
          guildId: interaction.guildId,
          type: shopTypes.indexOf(interaction.options.getSubcommand()),
        },
      });

      const externalBuyButton = new ButtonBuilder()
        .setCustomId('external-buy-button')
        .setLabel('Buy Now')
        .setStyle(ButtonStyle.Success);

      const externalRow = new ActionRowBuilder().addComponents(
        externalBuyButton
      );

      await items.forEach(async (item) => {
        const shopNewEmbed = new EmbedBuilder()
          .setColor(Colors.Blue)
          .setThumbnail(interaction.guild.iconURL({ size: 512 }))
          .setTitle(`${item.id} - ${item.name}`)
          .addFields(
            {
              name: 'Robux',
              value: `${item.priceRobux}`,
            },
            {
              name: 'Dollars',
              value: '$' + item.priceDollars.toFixed(2),
            }
          )
          .setImage(item.attachment)
          .setFooter({text: `Created By ${item.creator}`});

        if (item.dataSize) {
          shopNewEmbed.addFields({
            name: 'Data Size',
            value: `${item.dataSize}`,
          });
        }

        const response = await interaction.channel.send({
          embeds: [shopNewEmbed],
          components: [externalRow],
        });

        await Shop.update({ messageId: response.id }, { where: { id: item.id } });
      });

      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('Successfully send all items!')
            .setColor(Colors.Green),
        ],
        ephemeral: true,
      });
    }

    const items = await Shop.findAndCountAll(
      {
        where: {
          guildId: interaction.guildId,
          type: shopTypes.indexOf(interaction.options.getSubcommand()),
        },
      },
      { raw: true }
    );
    if (!items.count)
      return await interaction.editReply({
        content: 'No items avaliable.',
        ephemeral: true,
      });

    let index = 0;

    const forwardButton = new ButtonBuilder()
      .setCustomId('shop-forward')
      .setLabel('Next →')
      .setDisabled(index + 1 >= items.count)
      .setStyle(ButtonStyle.Primary);

    const backButton = new ButtonBuilder()
      .setCustomId('shop-back')
      .setLabel('← Back')
      .setDisabled(index <= 0)
      .setStyle(ButtonStyle.Primary);

    const buyButton = new ButtonBuilder()
      .setCustomId('shop-buy')
      .setLabel('Buy Now')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(
      backButton,
      buyButton,
      forwardButton
    );

    const shopEmbed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setThumbnail(interaction.guild.iconURL({ size: 512 }))
      .setAuthor({
        name: interaction.options.getSubcommand(),
        iconURL: interaction.guild.iconURL(),
      })
      .setTitle(`${index + 1} - ` + items.rows[index].name)
      .addFields(
        { name: 'Robux', value: `${items.rows[index].priceRobux}` },
        {
          name: 'Dollars',
          value: '$' + items.rows[index].priceDollars.toFixed(2),
        }
      )
      .setImage(items.rows[index].attachment)
      .setFooter({
        text: `${interaction.user.username}'s Menu | Page ${index + 1}/${items.count
          }`,
      });

    if (items.rows[index].dataSize) {
      shopEmbed.addFields({
        name: 'Data Size',
        value: `${items.rows[index].dataSize}`,
      });
    }

    if (items.rows[index].creator !== 'Unknown') {
      shopEmbed.addFields({
        name: 'Created By',
        value: items.rows[index].creator,
      });
    }

    return await interaction.editReply({
      embeds: [shopEmbed],
      components: [row],
      ephemeral: true,
    });
  },
};
