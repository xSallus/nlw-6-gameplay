import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";

import { Alert } from "react-native";

import * as AuthSession from 'expo-auth-session';

import {
	storeData,
	retrieveData,
	eraseData
} from "../services/storage";

import { useMatch } from "./useMatch";
import { api } from "../services/api";
import { IUser } from "../custom-types.d";

import {
	REDIRECT_URI,
	SCOPE,
	RESPONSE_TYPE,
	CLIENT_ID,
	CDN_IMAGE,
	BASE_URL
} from "@env";

type AuthResponse = AuthSession.AuthSessionResult & {
  params: {
    access_token?: string;
    error?: string;
  }
}

type ProviderProps = {
	children: ReactNode;
}

type AuthData = {
	user: IUser;
	signIn: ()=>Promise<void>;
	signOut: ()=>Promise<void>;
}

const authUrl = `${BASE_URL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

const authKey = "@gameplay::user";

const AuthContext = createContext({} as AuthData)

export function AuthProvider({
	children
}: ProviderProps) {
	const [user, setUser] = useState<IUser>({} as IUser)
	const { key: matchKey } = useMatch()

	const signIn = async () => {
		try {
			const { type, params } = await AuthSession
        .startAsync({ authUrl })
				.catch(err => console.error(err)) as AuthResponse;
			if (type !== "success" && params.error) {
				throw new Error(params.error)
			}
      api.defaults.headers.authorization = `Bearer ${params.access_token}`;

      const userInfo = await api.get('/users/@me')
			  .catch(err => console.error(err));

      const firstName = userInfo.data.username.split(' ')[0];
      userInfo.data.avatar = `${CDN_IMAGE}/avatars/${userInfo.data.id}/${userInfo.data.avatar}.png`;

      const userData = {
        ...userInfo.data,
        name: firstName,
        token: params.access_token,
				bio: userInfo.data.bio ?? 'Another otaku fdp.',
				available: false
      }

      await storeData(
				authKey,
				JSON.stringify(userData)
			).catch(err=>console.error(err))

      setUser(userData);
		} catch(err) {
			console.error(err)
		} /*finally {
			console.log(user)
		}*/
	}

	const signOut = async signOut => {
		const response = {}
		setUser(response)
		await eraseData([authKey, matchKey])
			.catch(err => console.error(err))
	}

	useEffect(()=>{
		retrieveData(authKey)
			.then((data)=>{
				if(data) {
					const parsed = JSON.parse(data)
					setUser(parsed)
				}
			})
	}, [])

	return (
		<AuthContext.Provider value={{
			user,
			signIn,
			signOut
		}}>
			{ children }
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext);
}
