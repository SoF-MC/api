import { FastifyRequest, FastifyReply, HTTPMethods, FastifySchema, RouteGenericInterface, FastifyInstance } from 'fastify';

export interface UserData {
	id: string,
	username: string,
	discriminator: string,
	avatar: string,
	tag: string
}

export interface CardData {
	ownerId: string,
	name: string,
	balance: number
}

export interface ActionData {
	createdAt?: string,
	userId: string,
	recieverId?: string,
	amount: number
}

export interface TicketData {
	channelId: string,
	userId: string,
	data: {
		nick: string,
		age: number,
		desc: string
	},
	reason?: string,
	closed: boolean
}

export interface TransferOptions {
	recieverId: string,
	amount: number
}

export interface ActionCreateOptions {
	userId: string,
	recieverId?: string,
	amount: number
}

export interface AppOptions { }

export interface AppRoute {
	run: (request: FastifyRequest<any>, reply: FastifyReply<any>) => any | Promise<any>,
	schema?: FastifySchema,
	route: string,
	register: (app: FastifyInstance) => any
	method: HTTPMethods,
}

export interface DefaultHeaders {
	authorisation: string
}

//Discord api raw things

export interface DiscordRawApiResponse {
	data: DiscordRawApiData
}

export type DiscordUserLocale =
	"da" | "de" | "en-GB" | "en-US" | "es-ES" | "fr" | "hr" | "it" | "lt" | "hu" | "nl" | "no" | "pl" | "pt-BR" | "ro" | "fi" | "sv-SE" | "vi" | "tr" | "cs" | "el" | "bg" | "ru" | "uk" | "hi" | "th" | "zh-CN" | "ja" | "zh-TW" | "ko"

export type DiscordUserPremiumType = 0 | 1 | 2

export interface DiscordRawApiData {
	id: string,
	username: string,
	discriminator: string,
	avatar: string,
	bot?: boolean,
	system?: boolean,
	mfa_enabled?: boolean,
	banner: string,
	accent_color: number
	locale: DiscordUserLocale,
	flags: number,
	premium_type: DiscordUserPremiumType,
	public_flags: number
}

