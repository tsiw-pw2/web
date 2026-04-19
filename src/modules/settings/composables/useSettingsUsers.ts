import { blockUser, settingsUsersRef, unblockUser } from "@/modules/settings/services/settingsUsers"

export function useSettingsUsers() {
	return {
		users: settingsUsersRef,
		blockUser,
		unblockUser,
	}
}
