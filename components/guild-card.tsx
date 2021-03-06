import React from "react";

import { TouchableOpacityProps } from "react-native";

import {
	Icon,
	Text,
	HStack,
	VStack,
	Button
} from "native-base";

import { Feather } from "@expo/vector-icons";
import { GuildBadge } from "./guild-badge";
import { AnimatedCard } from "./animated-card-basis";
import { IGuild } from "../custom-types.d";

type Props = TouchableOpacityProps & {
	guild: IGuild;
}

export function GuildCard({ guild, ...rest }:Props) {
	return (
	<AnimatedCard>
		<Button
			bg="transparent"
			_pressed={{
				bg: "transparent",
				opacity: 0.68
			}}
			{...rest}
		>
			<HStack
				justifyContent="flex-start"
				alignItems="flex-start"
				width="full"
				space={3}
			>
				<GuildBadge guild={guild} />
				<VStack width="65%" space={2}>
					<Text color="blue.200">
						{guild.name}
					</Text>
					<Text color="gray.400">
						{guild.owner ? "Ademiro" : "Guest"}
					</Text>
				</VStack>
				<Icon
					as={Feather}
					alignSelf="center"
					name="chevron-right"
					color="blue.50"
					size={8}
				/>
			</HStack>
		</Button>
	</AnimatedCard>
	)
}
