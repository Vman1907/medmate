'use client';

import { Button } from '@/components/ui/button';
import useBoolean from '@/hooks/useBoolean';
import { META_APP_ID, META_PAGES_CONFIG_ID } from '@/lib/consts';
import { Facebook } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { disconnectPage, generateAuthToken } from '../../actions';

export type LinkFacebookAccountHandle = {
	close: () => void;
	open: () => void;
};

export const LinkFacebookAccountButton = () => {
	const { value: isLoading, ...setLoading } = useBoolean();

	async function validateCode(code: string) {
		toast.promise(generateAuthToken(code), {
			loading: 'Linking your Facebook account...',
			success: 'Facebook account linked successfully',
			error: 'Failed to link Facebook account',
		});
	}

	// --------------------------------------------- META REGISTRATION SCRIPTS ---------------------------------------------

	useEffect(() => {
		(window as any).fbAsyncInit = () => {
			(window as any).FB.init({
				appId: META_APP_ID,
				cookie: true,
				xfbml: true,
				version: 'v22.0',
			});
		};

		(function (d, s, id) {
			const fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) {
				return;
			}
			const js = d.createElement(s);
			js.id = id;
			(js as any).src = 'https://connect.facebook.net/en_US/sdk.js';
			fjs.parentNode?.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');
	}, []);

	async function launchFacebookAdConnection() {
		// Launch Facebook login
		setLoading.on();
		(window as any).FB.login(
			function (data: any) {
				if (!data.authResponse) {
					setLoading.off();
					toast.error('Login cancelled or did not fully authorize.');
					return;
				}
				const code = data.authResponse.code;
				validateCode(code);
			},
			{
				config_id: META_PAGES_CONFIG_ID,
				response_type: 'code',
				override_default_response_type: true,
			}
		);
	}

	// --------------------------------------------- META REGISTRATION SCRIPTS  END ---------------------------------------------

	return (
		<Button
			className='ml-auto bg-blue-500 hover:bg-blue-600'
			onClick={launchFacebookAdConnection}
			disabled={isLoading}
		>
			<Facebook className='w-4 h-4 mr-2' />
			Connect With Facebook
		</Button>
	);
};

export const DisconnectButton = () => {
	const disconnectFacebook = async () => {
		toast.promise(disconnectPage(), {
			loading: 'Disconnecting your Facebook account...',
			success: 'Facebook account disconnected successfully',
			error: 'Failed to disconnect Facebook account',
		});
	};

	return (
		<Button
			className='ml-auto border-destructive text-destructive hover:border-destructive/90 hover:text-destructive/90'
			variant={'outline'}
			onClick={disconnectFacebook}
		>
			Disconnect
		</Button>
	);
};
