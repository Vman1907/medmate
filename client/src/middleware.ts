import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	// const pathname = request.nextUrl.pathname;
	// const roleBasedPath = '/panel';
	// if (!pathname.startsWith(roleBasedPath) && !pathname.startsWith('/auth')) {
	// 	return;
	// }
	// const {
	// 	authenticated: isAuthenticated,
	// 	agent: isAgent,
	// 	master: isMaster,
	// } = await AuthService.isAuthenticated();
	// debugPrint('isAuthenticated', isAuthenticated, pathname);
	// if (pathname.startsWith('/auth')) {
	// 	if (isAuthenticated) {
	// 		const callback = request.nextUrl.searchParams.get('callback');
	// 		return Response.redirect(new URL(callback || `${roleBasedPath}/home/dashboard`, request.url));
	// 	} else {
	// 		return;
	// 	}
	// }
	// if (pathname.startsWith(roleBasedPath)) {
	// 	if (!isAuthenticated) {
	// 		return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
	// 	}
	// 	if (isAgent) {
	// 		const { permissions } = (await AuthService.userDetails())!;
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.ChatbotFlow}/new`) &&
	// 			!permissions.chatbot.create
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.ChatbotFlow}/`) &&
	// 			!permissions.chatbot.update
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.WhatsappFlow}/create`) &&
	// 			!permissions.chatbot_flow.create
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.WhatsappFlow}/`) &&
	// 			!permissions.chatbot_flow.update
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.Broadcast}`) &&
	// 			!permissions.broadcast.create
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (pathname.startsWith(`${roleBasedPath}${Paths.Report}`) && !permissions.broadcast.report) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.Recurring}/create`) &&
	// 			!permissions.recurring.create
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.Recurring}/`) &&
	// 			!permissions.recurring.update
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.Templates}/create`) &&
	// 			!permissions.template.create
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.Templates}/`) &&
	// 			!permissions.template.update
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 		if (
	// 			pathname.startsWith(`${roleBasedPath}${Paths.ButtonReport}`) &&
	// 			!permissions.buttons.read
	// 		) {
	// 			return Response.redirect(new URL(`/permission-denied`, request.url));
	// 		}
	// 	}
	// 	if (pathname.startsWith(`${roleBasedPath}${Paths.Admin}`) && !isMaster) {
	// 		return Response.redirect(new URL(`/permission-denied`, request.url));
	// 	}
	// 	if (pathname.startsWith(`${roleBasedPath}${Paths.Coupons}`) && !isMaster) {
	// 		return Response.redirect(new URL(`/permission-denied`, request.url));
	// 	}
	// 	if (pathname.startsWith(`${roleBasedPath}${Paths.Extras}`) && !isMaster) {
	// 		return Response.redirect(new URL(`/permission-denied`, request.url));
	// 	}
	// 	if (
	// 		pathname.startsWith(`${roleBasedPath}${Paths.Ads}`) &&
	// 		pathname !== `${roleBasedPath}${Paths.Ads}/setup`
	// 	) {
	// 		const pageDetails = await AdCampaignService.getPageDetails();
	// 		if (!pageDetails.is_registered || !pageDetails.is_number_verified) {
	// 			return Response.redirect(new URL(`/panel/ads/setup`, request.url));
	// 		}
	// 	}
	// }
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
