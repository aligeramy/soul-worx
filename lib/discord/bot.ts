/**
 * Discord Bot Utilities
 * 
 * Handles Discord server management:
 * - Assigning/removing roles
 * - Creating/managing channels
 * - Sending DMs
 * - Syncing user access based on membership tiers
 */

import { Client, GatewayIntentBits, TextChannel, PermissionFlagsBits, ChannelType } from 'discord.js'

// Singleton Discord client
let discordClient: Client | null = null

/**
 * Initialize Discord bot client
 */
export async function getDiscordClient(): Promise<Client> {
  if (discordClient && discordClient.isReady()) {
    return discordClient
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
    ],
  })

  const token = process.env.DISCORD_BOT_TOKEN
  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN is not set')
  }

  await client.login(token)
  discordClient = client

  return client
}

/**
 * Get the guild (server) object
 */
export async function getGuild() {
  const client = await getDiscordClient()
  const guildId = process.env.DISCORD_GUILD_ID
  
  if (!guildId) {
    throw new Error('DISCORD_GUILD_ID is not set')
  }

  const guild = await client.guilds.fetch(guildId)
  return guild
}

/**
 * Assign a role to a user
 */
export async function assignRole(discordUserId: string, roleId: string): Promise<boolean> {
  try {
    const guild = await getGuild()
    const member = await guild.members.fetch(discordUserId)
    const role = await guild.roles.fetch(roleId)

    if (!role) {
      console.error(`Role ${roleId} not found`)
      return false
    }

    await member.roles.add(role)
    console.log(`Assigned role ${role.name} to user ${discordUserId}`)
    return true
  } catch (error) {
    console.error('Error assigning role:', error)
    return false
  }
}

/**
 * Remove a role from a user
 */
export async function removeRole(discordUserId: string, roleId: string): Promise<boolean> {
  try {
    const guild = await getGuild()
    const member = await guild.members.fetch(discordUserId)
    const role = await guild.roles.fetch(roleId)

    if (!role) {
      console.error(`Role ${roleId} not found`)
      return false
    }

    await member.roles.remove(role)
    console.log(`Removed role ${role.name} from user ${discordUserId}`)
    return true
  } catch (error) {
    console.error('Error removing role:', error)
    return false
  }
}

/**
 * Send a DM to a user
 */
export async function sendDM(
  discordUserId: string,
  message: string
): Promise<boolean> {
  try {
    const client = await getDiscordClient()
    const user = await client.users.fetch(discordUserId)
    
    await user.send(message)
    console.log(`Sent DM to user ${discordUserId}`)
    return true
  } catch (error) {
    console.error('Error sending DM:', error)
    return false
  }
}

/**
 * Create a new text channel in the server
 */
export async function createChannel(
  channelName: string,
  categoryId?: string,
  isPrivate: boolean = false
): Promise<string | null> {
  try {
    const guild = await getGuild()
    
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      permissionOverwrites: isPrivate ? [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ] : undefined,
    })

    console.log(`Created channel: ${channelName} (${channel.id})`)
    return channel.id
  } catch (error) {
    console.error('Error creating channel:', error)
    return null
  }
}

/**
 * Update channel permissions for a role
 */
export async function updateChannelPermissions(
  channelId: string,
  roleId: string,
  canView: boolean
): Promise<boolean> {
  try {
    const guild = await getGuild()
    const channel = await guild.channels.fetch(channelId)

    if (!channel || !channel.isTextBased()) {
      console.error(`Channel ${channelId} not found or not text-based`)
      return false
    }

    await (channel as TextChannel).permissionOverwrites.edit(roleId, {
      ViewChannel: canView,
      SendMessages: canView,
    })

    console.log(`Updated permissions for role ${roleId} in channel ${channelId}`)
    return true
  } catch (error) {
    console.error('Error updating channel permissions:', error)
    return false
  }
}

/**
 * Send a message to a channel
 */
export async function sendChannelMessage(
  channelId: string,
  message: string
): Promise<boolean> {
  try {
    const guild = await getGuild()
    const channel = await guild.channels.fetch(channelId)

    if (!channel || !channel.isTextBased()) {
      console.error(`Channel ${channelId} not found or not text-based`)
      return false
    }

    await (channel as TextChannel).send(message)
    console.log(`Sent message to channel ${channelId}`)
    return true
  } catch (error) {
    console.error('Error sending channel message:', error)
    return false
  }
}

/**
 * Sync user's Discord roles based on their membership tier
 */
export async function syncUserRoles(
  discordUserId: string,
  newRoleId: string,
  previousRoleIds: string[] = []
): Promise<boolean> {
  try {
    // Remove previous tier roles
    for (const roleId of previousRoleIds) {
      await removeRole(discordUserId, roleId)
    }

    // Assign new tier role
    const success = await assignRole(discordUserId, newRoleId)
    
    if (success) {
      console.log(`Successfully synced roles for user ${discordUserId}`)
    }
    
    return success
  } catch (error) {
    console.error('Error syncing user roles:', error)
    return false
  }
}

/**
 * Check if a user is in the server
 */
export async function isUserInServer(discordUserId: string): Promise<boolean> {
  try {
    const guild = await getGuild()
    const member = await guild.members.fetch(discordUserId)
    return !!member
  } catch {
    return false
  }
}

/**
 * Get user information from Discord
 */
export async function getDiscordUser(discordUserId: string) {
  try {
    const client = await getDiscordClient()
    const user = await client.users.fetch(discordUserId)
    return {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      tag: user.tag,
    }
  } catch (error) {
    console.error('Error fetching Discord user:', error)
    return null
  }
}

/**
 * Create or get category for community channels
 */
export async function getOrCreateCommunityCategory(categoryName: string = "Community Learning"): Promise<string | null> {
  try {
    const guild = await getGuild()
    
    // Check if category already exists
    const existingCategory = guild.channels.cache.find(
      (channel) => channel.type === ChannelType.GuildCategory && channel.name === categoryName
    )

    if (existingCategory) {
      return existingCategory.id
    }

    // Create new category
    const category = await guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
    })

    console.log(`Created category: ${categoryName} (${category.id})`)
    return category.id
  } catch (error) {
    console.error('Error creating/getting category:', error)
    return null
  }
}

/**
 * Cleanup: Close Discord client connection
 */
export async function closeDiscordClient() {
  if (discordClient) {
    await discordClient.destroy()
    discordClient = null
  }
}

