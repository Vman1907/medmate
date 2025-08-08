'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AuthDialog({ children }: { children: React.ReactNode }) {
	const { login } = useAuth();
	const [screen, setScreen] = useState<'details' | 'pin'>('details');
	const [email, setEmail] = useState('');
	const [pin, setPin] = useState('');
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	async function handleSendOTP() {
		if (!email) {
			toast.error('Please fill in all fields');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/auth/send-otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success('OTP sent to your email!');
				setScreen('pin');
			} else {
				toast.error(data.error || 'Failed to send OTP');
			}
		} catch (error) {
			toast.error('Network error. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	async function handleVerifyOTP() {
		if (pin.length !== 6) {
			toast.error('Please enter a 6-digit OTP');
			return;
		}

		setLoading(true);
		try {
			const response = await fetch('/api/auth/verify-otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, otp: pin }),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success('Login successful!');
				login(data.user);
				setIsOpen(false);
				// Reset form
				setEmail('');
				setPin('');
				setScreen('details');
			} else {
				toast.error(data.error || 'Invalid OTP');
			}
		} catch (error) {
			toast.error('Network error. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild onClick={() => setIsOpen(true)}>
				{children}
			</DialogTrigger>
			<DialogContent className='p-0 max-w-xs md:max-w-md rounded-2xl'>
				<div className={cn('flex flex-col gap-6')}>
					<Card>
						<CardHeader>
							<CardTitle className='text-center'>Login to your account</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col gap-6'>
								{screen === 'details' && (
									<div className='grid gap-4'>
										<div className='grid gap-2'>
											<Label htmlFor='email'>Email</Label>
											<Input
												id='email'
												type='email'
												placeholder='m@example.com'
												required
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
										</div>
									</div>
								)}
								{screen === 'pin' && (
									<div className='items-center flex flex-col gap-3'>
										<InputOTP maxLength={6} value={pin} onChange={setPin}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
										<Label htmlFor='pin'>A 6-digit OTP has been sent to your email.</Label>
									</div>
								)}
								<div className='flex flex-col gap-3'>
									<Button
										type='submit'
										className='w-full'
										onClick={screen === 'details' ? handleSendOTP : handleVerifyOTP}
										disabled={loading}
									>
										{loading ? 'Loading...' : screen === 'details' ? 'Send OTP' : 'Verify OTP'}
									</Button>
									{screen === 'details' && (
										<>
											<Separator />
											<Button variant='outline' className='w-full'>
												Login with Google
											</Button>
										</>
									)}
									{screen === 'pin' && (
										<Button
											variant='outline'
											className='w-full'
											onClick={() => setScreen('details')}
										>
											Back to Details
										</Button>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
