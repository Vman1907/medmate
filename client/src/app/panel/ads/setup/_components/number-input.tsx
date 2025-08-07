'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import useBoolean from '@/hooks/useBoolean';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateNumber } from '../../actions';

export const AdNumberInput = ({ disabled }: { disabled: boolean }) => {
	const [mobile, setMobile] = useState<string>('');
	const [validatingMobile, setValidatingMobile] = useState<boolean>(false);
	const { value: isOTPInputOpen, on: openOTPInput, off: closeOTPInput } = useBoolean();

	function updateMobileNumber() {
		if (!mobile || mobile.length < 10) return;
		setValidatingMobile(true);
		updateNumber(mobile)
			.then((res) => {
				if (res.verification_code_sent) {
					openOTPInput();
				} else if (!res.is_number_verified && !res.verification_code_sent) {
					toast.error('Failed to verify number');
				} else {
					toast.success('Number verified successfully');
				}
			})
			.catch((err) => {
				toast.error('Failed to verify number');
			});
	}

	return (
		<div className='flex flex-col md:flex-row justify-center items-center gap-2 w-full'>
			<div className='flex-1 w-full'>
				<Input
					disabled={disabled}
					value={mobile}
					onChange={(e) => setMobile(e.target.value)}
					type='tel'
					placeholder='eg. 91XXXXXXXXXX'
				/>
			</div>
			<Button
				disabled={validatingMobile || disabled}
				onClick={updateMobileNumber}
				variant={'outline'}
			>
				Verify
			</Button>
			<OTPInputDialog isOpen={isOTPInputOpen} open={openOTPInput} close={closeOTPInput} />
		</div>
	);
};

const OTPInputDialog = ({
	isOpen,
	open,
	close,
}: {
	isOpen: boolean;
	open: () => void;
	close: () => void;
}) => {
	const [otp, setOtp] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const handleSave = () => {
		setLoading(true);
	};

	return (
		<Dialog open={isOpen}>
			<DialogContent className='sm:max-w-[425px] md:max-w-md lg:max-w-lg'>
				<DialogHeader>
					<DialogTitle className='text-center'>Input OTP</DialogTitle>
				</DialogHeader>
				<div>
					<div className='space-y-4'>
						<div>
							<Label htmlFor='OTP' className='text-primary'>
								Enter OTP<span className='ml-[0.2rem] text-red-800'>*</span>
							</Label>
							<div className='flex flex-col md:flex-row justify-center items-center gap-2'>
								<InputOTP maxLength={6} value={otp} onChange={(e) => setOtp(e)}>
									<InputOTPGroup>
										<InputOTPSlot index={0} />
										<InputOTPSlot index={1} />
										<InputOTPSlot index={2} />
										<InputOTPSlot index={3} />
										<InputOTPSlot index={4} />
										<InputOTPSlot index={5} />
									</InputOTPGroup>
								</InputOTP>
								<Button size='sm'>Submit</Button>
							</div>
						</div>

						<Button onClick={() => handleSave()} disabled={loading} className='w-full'>
							<ShieldCheck className='w-4 h-4 mr-2' />
							Save
						</Button>
						<Button variant={'link'} size='sm'>
							Wrong Number?
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
