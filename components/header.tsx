import React from "react";

import {
	Heading,
	HStack,
	VStack,
	Button,
	Image,
	Icon,
	Text,
	Box
} from "native-base";

import {
	MaterialCommunityIcons
} from '@expo/vector-icons';

import { useAuth } from "../hooks/useAuth";

export function Header() {
	const { signOut, user } = useAuth()

	return (
		<Box
			width="full"
			height={16}
			px={6}
			py={2}
		>
			<HStack width="full" space={4}>
				<Button
					onPress={signOut}
					size={45}
					borderRadius={8}
				>
					<Image
						size={45}
						borderRadius={8}
						source={{uri:user.avatar}}
						alt="User profile picture"
					/>
				</Button>

				<VStack flex={1}>
					<Heading color="blue.50">
						{user.name}
					</Heading>
					<Text color="gray.100">
						{user.bio}
					</Text>
				</VStack>                                     

				<Button
					bg="red.500"
					p={3}
					borderRadius={8}
				>
					<Icon
						as={MaterialCommunityIcons}
						name="plus"                               
						color="blue.50"
						size="lg"
					/>
				</Button>
			</HStack>
		</Box>
	)
}