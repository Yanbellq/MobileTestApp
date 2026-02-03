import { PAGES } from '@/config/pages.config'
import { useAuth } from '@/hooks/useAuth'
import { updatePassword, updateProfile } from '@/lib/auth'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'

const AccountScreen: React.FC = () => {
	const { user, loading, logout, refreshUser } = useAuth()
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [editName, setEditName] = useState('')
	const [editEmail, setEditEmail] = useState('')
	const [editAvatar, setEditAvatar] = useState('')
	const [isChangingPassword, setIsChangingPassword] = useState(false)
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmNewPassword, setConfirmNewPassword] = useState('')
	const [profileMsg, setProfileMsg] = useState<string | null>(null)
	const [passwordMsg, setPasswordMsg] = useState<string | null>(null)
	const [profileLoading, setProfileLoading] = useState(false)
	const [passwordLoading, setPasswordLoading] = useState(false)

	if (loading) {
		return (
			<View style={[styles.container, styles.centerContent]}>
				<ActivityIndicator
					size="large"
					color="#50FFA1"
				/>
			</View>
		)
	}

	if (!user) {
		return (
			<View style={[styles.container, styles.centerContent]}>
				<Text style={styles.emptyText}>
					Please log in to view your account.
				</Text>
				<TouchableOpacity
					style={styles.loginButton}
					onPress={() => router.push(PAGES.LOGIN)}
				>
					<Text style={styles.loginButtonText}>Log In</Text>
				</TouchableOpacity>
			</View>
		)
	}

	const currentName = (user as any).name ?? user.email?.split('@')[0] ?? ''
	const currentEmail = user.email ?? ''

	const handleToggleEdit = () => {
		if (!isEditing) {
			setEditName(currentName)
			setEditEmail(currentEmail)
			setEditAvatar(user.profile?.avatarUrl || '')
		}
		setProfileMsg(null)
		setIsEditing(prev => !prev)
	}

	const handleSaveProfile = async () => {
		setProfileLoading(true)
		setProfileMsg(null)
		try {
			await updateProfile({
				name: editName,
				email: editEmail,
				avatarUrl: editAvatar
			})
			await refreshUser()
			setProfileMsg('Профіль оновлено!')
			setIsEditing(false)
		} catch (e: any) {
			setProfileMsg(e.message || 'Помилка оновлення профілю')
		} finally {
			setProfileLoading(false)
		}
	}

	const handleSavePassword = async () => {
		setPasswordLoading(true)
		setPasswordMsg(null)
		if (newPassword !== confirmNewPassword) {
			setPasswordMsg('Паролі не співпадають')
			setPasswordLoading(false)
			return
		}
		try {
			await updatePassword({
				currentPassword,
				newPassword
			})
			setPasswordMsg('Пароль змінено!')
			setIsChangingPassword(false)
			setCurrentPassword('')
			setNewPassword('')
			setConfirmNewPassword('')
		} catch (e: any) {
			setPasswordMsg(e.message || 'Помилка зміни паролю')
		} finally {
			setPasswordLoading(false)
		}
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.content}
		>
			<View style={styles.pageHeader}>
				<View style={styles.pageHeaderIconWrapper}>
					<MaterialIcons
						name="account-circle"
						size={80}
						color="#EFFFF7"
					/>
				</View>
				<Text style={styles.pageHeaderTitle}>My Account</Text>
				<Text style={styles.pageHeaderSubtitle}>
					Manage your account information
				</Text>
			</View>

			<View style={styles.sectionHeaderRow}>
				<View>
					<Text style={styles.sectionTitle}>Personal Information</Text>
				</View>
				<TouchableOpacity
					style={styles.editButton}
					onPress={handleToggleEdit}
				>
					<Text style={styles.editButtonText}>
						{isEditing ? 'Close' : 'Edit'}
					</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.card}>
				<View style={styles.cardRow}>
					<Text style={styles.cardLabel}>Name</Text>
					{isEditing ? (
						<TextInput
							style={[styles.cardValue, styles.inlineInput]}
							placeholder="Enter name"
							placeholderTextColor="#6C7A89"
							value={editName}
							onChangeText={setEditName}
						/>
					) : (
						<Text style={styles.cardValue}>{currentName || '-'}</Text>
					)}
				</View>
				<View style={styles.divider} />
				<View style={styles.cardRow}>
					<Text style={styles.cardLabel}>Email</Text>
					{isEditing ? (
						<TextInput
							style={[styles.cardValue, styles.inlineInput]}
							placeholder="Enter email"
							placeholderTextColor="#6C7A89"
							keyboardType="email-address"
							autoCapitalize="none"
							value={editEmail}
							onChangeText={setEditEmail}
						/>
					) : (
						<Text style={styles.cardValue}>{currentEmail || '-'}</Text>
					)}
				</View>
				<View style={styles.divider} />
				<View style={styles.cardRow}>
					<Text style={styles.cardLabel}>Avatar URL</Text>
					{isEditing ? (
						<TextInput
							style={[styles.cardValue, styles.inlineInput]}
							placeholder="Enter avatar URL"
							placeholderTextColor="#6C7A89"
							value={editAvatar}
							onChangeText={setEditAvatar}
						/>
					) : (
						<Text style={styles.cardValue}>
							{user.profile?.avatarUrl || '-'}
						</Text>
					)}
				</View>
				<View style={styles.divider} />
				{isEditing && (
					<TouchableOpacity
						style={styles.saveProfileButton}
						onPress={handleSaveProfile}
						disabled={profileLoading}
					>
						<Text style={styles.saveProfileText}>
							{profileLoading ? 'Saving...' : 'Save'}
						</Text>
					</TouchableOpacity>
				)}
				{profileMsg && (
					<Text
						style={{
							color: profileMsg.includes('Помилка') ? 'red' : 'green',
							marginTop: 8
						}}
					>
						{profileMsg}
					</Text>
				)}
				<View style={styles.cardRow}>
					<Text style={styles.cardLabel}>User Type</Text>
					<Text style={styles.cardValue}>{user.profile?.role ?? 'WORKER'}</Text>
				</View>
				<View style={styles.divider} />
				<View style={styles.cardRow}>
					<Text style={styles.cardLabel}>Member Since</Text>
					<Text style={styles.cardValue}>
						{user.createdAt?.slice(0, 10) ?? '-'}
					</Text>
				</View>
			</View>

			<View style={styles.sectionHeaderRow}>
				<Text style={styles.sectionTitle}>Account Actions</Text>
			</View>

			<View style={styles.actionsCard}>
				<TouchableOpacity
					style={styles.changePasswordButton}
					onPress={() => setIsChangingPassword(prev => !prev)}
				>
					<Text style={styles.changePasswordText}>
						{isChangingPassword ? 'Close' : 'Change Password'}
					</Text>
				</TouchableOpacity>

				{isChangingPassword && (
					<View style={styles.changePasswordForm}>
						<View style={styles.passwordFieldGroup}>
							<Text style={styles.passwordLabel}>Current Password</Text>
							<TextInput
								style={styles.passwordInput}
								placeholder="Enter current password"
								placeholderTextColor="#6C7A89"
								secureTextEntry
								value={currentPassword}
								onChangeText={setCurrentPassword}
							/>
						</View>
						<View style={styles.passwordFieldGroup}>
							<Text style={styles.passwordLabel}>New Password</Text>
							<TextInput
								style={styles.passwordInput}
								placeholder="Enter new password"
								placeholderTextColor="#6C7A89"
								secureTextEntry
								value={newPassword}
								onChangeText={setNewPassword}
							/>
						</View>
						<View style={styles.passwordFieldGroup}>
							<Text style={styles.passwordLabel}>Confirm New Password</Text>
							<TextInput
								style={styles.passwordInput}
								placeholder="Repeat new password"
								placeholderTextColor="#6C7A89"
								secureTextEntry
								value={confirmNewPassword}
								onChangeText={setConfirmNewPassword}
							/>
						</View>
						<TouchableOpacity
							style={styles.savePasswordButton}
							activeOpacity={0.9}
							onPress={handleSavePassword}
							disabled={passwordLoading}
						>
							<Text style={styles.savePasswordText}>
								{passwordLoading ? 'Saving...' : 'Save'}
							</Text>
						</TouchableOpacity>
						{passwordMsg && (
							<Text
								style={{
									color:
										passwordMsg.includes('Помилка') ||
										passwordMsg.includes('Паролі')
											? 'red'
											: 'green',
									marginTop: 8
								}}
							>
								{passwordMsg}
							</Text>
						)}
					</View>
				)}
				<TouchableOpacity
					style={styles.logoutButton}
					onPress={async () => {
						try {
							await logout()
							router.replace(PAGES.HOME)
						} catch (e) {
							console.log(e)
						}
					}}
				>
					<Text style={styles.logoutText}>Logout</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)
}

export default AccountScreen

const styles = StyleSheet.create({
	saveProfileButton: {
		backgroundColor: '#50FFA1',
		borderRadius: 8,
		paddingVertical: 12,
		alignItems: 'center',
		marginVertical: 16
	},
	saveProfileText: {
		color: '#012333',
		fontSize: 16,
		fontWeight: '700'
	},
	container: {
		flex: 1,
		backgroundColor: '#012333'
	},
	content: {
		padding: 24
	},
	pageHeader: {
		alignItems: 'center',
		marginBottom: 24
	},
	pageHeaderIconWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 12
	},
	pageHeaderTitle: {
		color: '#EFFFF7',
		fontSize: 24,
		fontWeight: '800',
		marginBottom: 4
	},
	pageHeaderSubtitle: {
		color: '#A3B4C4',
		fontSize: 14
	},
	sectionHeaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16
	},
	sectionTitle: {
		color: '#EFFFF7',
		fontSize: 20,
		fontWeight: '700'
	},
	editButton: {
		borderColor: '#50FFA1',
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 6,
		borderRadius: 999
	},
	editButtonText: {
		color: '#50FFA1',
		fontWeight: '600'
	},
	card: {
		borderColor: '#50FFA1',
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
		marginBottom: 32,
		backgroundColor: 'rgba(0,0,0,0.25)'
	},
	cardRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 8
	},
	cardLabel: {
		color: '#EFFFF7'
	},
	cardValue: {
		color: '#50FFA1',
		fontWeight: '600'
	},
	inlineInput: {
		minWidth: 160,
		textAlign: 'right',
		paddingVertical: 0
	},
	divider: {
		height: 1,
		backgroundColor: '#16374A'
	},
	actionsCard: {
		borderRadius: 12,
		padding: 16,
		backgroundColor: '#021A26',
		borderColor: '#081F2C',
		borderWidth: 1
	},
	changePasswordButton: {
		borderColor: '#50FFA1',
		borderWidth: 1,
		borderRadius: 12,
		paddingVertical: 14,
		paddingHorizontal: 16
	},
	changePasswordText: {
		color: '#EFFFF7',
		fontWeight: '600',
		textAlign: 'center'
	},
	changePasswordForm: {
		marginTop: 12,
		gap: 10
	},
	passwordFieldGroup: {
		gap: 4
	},
	passwordLabel: {
		color: '#EFFFF7',
		fontSize: 14
	},
	passwordInput: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#26465A',
		paddingHorizontal: 12,
		paddingVertical: 10,
		color: '#EFFFF7',
		backgroundColor: '#022738'
	},
	savePasswordButton: {
		marginTop: 4,
		backgroundColor: '#50FFA1',
		borderRadius: 999,
		paddingVertical: 12,
		alignItems: 'center',
		justifyContent: 'center'
	},
	savePasswordText: {
		color: '#012333',
		fontWeight: '700'
	},
	logoutButton: {
		marginTop: 12,
		borderColor: '#FF4C4C',
		borderWidth: 1,
		borderRadius: 12,
		paddingVertical: 14,
		paddingHorizontal: 16
	},
	logoutText: {
		color: '#FF4C4C',
		fontWeight: '600',
		textAlign: 'center'
	},
	centerContent: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24
	},
	emptyText: {
		color: '#EFFFF7',
		fontSize: 18,
		marginBottom: 24,
		textAlign: 'center'
	},
	loginButton: {
		backgroundColor: '#50FFA1',
		paddingHorizontal: 32,
		paddingVertical: 12,
		borderRadius: 999
	},
	loginButtonText: {
		color: '#012333',
		fontWeight: '700',
		fontSize: 16
	}
})
