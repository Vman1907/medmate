import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Google Auth • Wautopilot',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <section>{children}</section>;
}
