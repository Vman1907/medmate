import Show from '@/components/containers/show';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

export default function DeleteDialog({
	children,
	message = 'This action cannot be undone. This will permanently delete the resource and remove all the data from our servers.',
	actionButtonText = 'Delete',
	onDelete,
	action,
	title = 'Are you absolutely sure?',
	primaryButton = false,
}: {
	action?: string;
	children: React.ReactNode;
	message?: string;
	actionButtonText?: string;
	onDelete: () => void;
	title?: string;
	primaryButton?: boolean;
}) {
	const [captcha, setCaptcha] = React.useState('');

	return (
		<AlertDialog
			onOpenChange={() => {
				setCaptcha('');
			}}
		>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{message}</AlertDialogDescription>
				</AlertDialogHeader>
				<Show.ShowIf condition={!!action}>
					<Label htmlFor='captcha'>Delete {action}</Label>
					<div>
						<Input
							value={captcha}
							onChange={(e) => setCaptcha(e.target.value)}
							placeholder={`Delete ${action}`}
						/>
					</div>
				</Show.ShowIf>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={
							primaryButton
								? ''
								: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
						}
						onClick={onDelete}
						disabled={!!action && captcha !== `Delete ${action}`}
					>
						{actionButtonText}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
