A bot used to moderate discord servers that manage shops. 🙋

## Features
### Audit Logs
Logs the following events to an audit logs channel:
- When a member leaves 🚪
- When a member joins 👋
- When a message is deleted ❌
- When a message is updated 🔁

### Verification
The bot verifies uses when they first enter using a simple 6-letter capcha. ✅
Displays a welcome message when a user verifies themselves. 👋

### Shop
- If a item in the is created, editied, or deleted, the bot will automatically update it's corresponding modal. 🌐
- If a user clicks the `Buy Now` button, a new transaction will be created in the `transactions` category. An embed containing information about the selected item will also be displayed. 📬

## Commands
### `/shop`
#### `[TYPE]`
This command (`/shop [TYPE]`) displays all items of a certain type. For example, `/shop gift-bases` displays all gift bases. Each embed comes with a buy button. 🛍

#### `menu`
This command (`/shop menu [add/edit]`) allows you to add edit, or delete an item in your shop. ➕

#### `send`
THis command (`/shop send [TYPE]`) sends all items of a type to a channel. This is useful if you forgot to setup the channels before creating new items. 📼

### `/info`
This command displays information about the server, such as the member count, date created, and server owner. ℹ

### `/setup`
This command allows you to add or delete information about the channels and roles in your server. 💾

### `/spam`
This command enables and disables a spam rule. 🔇

### `/verification`
This commmand sends a verification message to your `#verify` channel. It also creates a `@Verified` role, unless one already exists. ⏸

## Other
This bot was made using [discord.js](https://discord.js.org/#/), the data is stored using [SQLite3](https://www.npmjs.com/package/sqlite3) with the help of [Sequelize](https://sequelize.org/). This was my first time working with a database and I really enjoyed it!

*Completed June 10, 2023*
