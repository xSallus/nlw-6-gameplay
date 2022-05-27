import React, {
	useState,
	useEffect,
	useCallback
}from "react";

import { useFocusEffect } from "@react-navigation/native";


import {
	Box,
	VStack
} from "native-base";

import { Header } from "../components/header";
import { Categories } from "../components/categories";
import { Matches } from "../components/matches";
import { Skeleton } from "../components/skeleton";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

function HomeScreen({ navigation }: any) {
	const [loading, setLoading] = useState(true)
	const { retrieveMatches } = useForm()

	useFocusEffect(
		useCallback(() => {
			const { index, routes } = navigation.getState()
			const route = routes[index].name

			if(route === "Home") {
				setLoading(true)
				retrieveMatches()
					.catch(err => console.log(err))
			}

			return () => console.log("Home gone out of focus")
		}, [])
	)

	useEffect(()=>{
		if(loading) {
			setTimeout(()=>setLoading(false), 4000)
		}
	}, [loading])

	return (
		<VStack
			py={10}
			px={2}
			width="full"
			height="full"
			bg="gameplay.background"
		>
			<Header action={() => {
				navigation.navigate('ScheduleMatch')
			}} />
			<Categories type="show" />
			{loading ? (
				<Skeleton />
			) : (
				<Matches
					redirect={(screen:string, id:string) => {
						navigation.navigate(screen, { matchId: id })
					}}
				/>
			)}
		</VStack>
	)
}

export default HomeScreen;
