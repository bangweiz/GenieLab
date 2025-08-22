import { components } from "./types";

export type UserEntity = {
	_id: string;
	username: string;
	email: string;
	password: string;
	organisation_id: string;
	role: "root" | "admin" | "user";
};

export type User = components["schemas"]["Token"];
export type UserLogin = components["schemas"]["UserLogin"];
export type UserInfo = components["schemas"]["UserInfo"];
export type CreateUser = components["schemas"]["CreateUser"];
