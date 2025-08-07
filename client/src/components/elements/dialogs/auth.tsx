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
import { cn } from '@/lib/utils';
import { useState } from 'react';
export default function AuthDialog({ children }: { children: React.ReactNode }) {
	const [screen, setScreen] = useState<'email' | 'pin'>('email');

	function handleClick() {
		setScreen('pin');
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='p-0 max-w-md'>
				<div className={cn('flex flex-col gap-6')}>
					<Card>
						<CardHeader>
							<CardTitle className='text-center'>Login to your account</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='flex flex-col gap-6'>
								{screen === 'email' && (
									<div className='grid gap-3'>
										<Label htmlFor='email'>Email</Label>
										<Input id='email' type='email' placeholder='m@example.com' required />
									</div>
								)}
								{screen === 'pin' && (
									<div className=' items-center flex flex-col gap-3'>
										<InputOTP maxLength={6}>
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
									<Button type='submit' className='w-full' onClick={handleClick}>
										{screen === 'email' ? 'Continue' : 'Verify'}
									</Button>
									<Separator />
									<Button variant='outline' className='w-full'>
										Login with Google
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</DialogContent>
		</Dialog>
	);
}
