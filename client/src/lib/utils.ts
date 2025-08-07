import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function debugPrint(...args: any[]) {
	if (process.env.NODE_ENV !== 'production') {
		console.log(...args);
	}
}

export const getMonth = (month: number, fullName = false) => {
	const MONTHS = {
		'1': 'January',
		'2': 'February',
		'3': 'March',
		'4': 'April',
		'5': 'May',
		'6': 'June',
		'7': 'July',
		'8': 'August',
		'9': 'September',
		'10': 'October',
		'11': 'November',
		'12': 'December',
	};
	if (month < 1 || month > 12) {
		return '';
	}
	const name = MONTHS[month.toString() as keyof typeof MONTHS];
	return fullName ? name! : name!.substring(0, 3);
};

export const getFormattedDay = (date: number) => {
	return date < 10 ? `0${date}` : date.toString();
};

export const getFormattedDate = (date: Date = new Date()) => {
	const day = getFormattedDay(date.getDate());
	const month = getFormattedDay(date.getMonth() + 1);
	const year = date.getFullYear();
	return `${year}-${month}-${day}`;
};

export const getFormattedDateTimestamp = (date: Date = new Date()) => {
	const day = getFormattedDay(date.getDate());
	const month = getFormattedDay(date.getMonth() + 1);
	const year = date.getFullYear();
	const hours = getFormattedDay(date.getHours());
	const minutes = getFormattedDay(date.getMinutes());
	const seconds = getFormattedDay(date.getSeconds());
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const getDateObject = (dateStr: string) => {
	const year = parseInt(dateStr.split('-')[0]);
	const month = parseInt(dateStr.split('-')[1]);
	const day = parseInt(dateStr.split('-')[2]);
	return new Date(year, month - 1, day);
};

export const isDateBetween = (
	date: Date | string,
	startDate: Date | string,
	endDate: Date | string
): boolean => {
	const target = new Date(date).getTime();
	const start = new Date(startDate).getTime();
	const end = new Date(endDate).getTime();

	if (isNaN(target) || isNaN(start) || isNaN(end)) {
		throw new Error('Invalid date provided.');
	}

	return target >= start && target <= end;
};

export const formatPhoneNumber = (phoneNumber: string) => {
	//mark first 4 digit last 2 digits visible others should be X
	const visibleFirst = phoneNumber.substring(0, 4);
	const visibleLast = phoneNumber.substring(phoneNumber.length - 4);
	const hidden = phoneNumber.substring(4, phoneNumber.length - 4).replace(/\d/g, 'X');
	return `${visibleFirst}${hidden}${visibleLast}`;
};

export const mobileCheck = function () {
	let check = false;
	(function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true;
	})(navigator.userAgent || navigator.vendor || (window as any).opera);
	return check;
};

export function getInitials(fullName: string) {
	return fullName
		.replaceAll(/[^a-zA-Z ]/g, '')
		.split(' ')
		.map((name) => name.charAt(0))
		.join('')
		.toUpperCase();
}

export function randomString(length: number = 6) {
	const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let result = '';
	for (let i = length; i > 0; --i) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
}

export function debounce(callback: (...args: any[]) => void, delay: number) {
	let timer: NodeJS.Timeout;
	return (...args: any[]) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			callback(...args);
		}, delay);
	};
}

export function getFileType(mimeType: string) {
	if (mimeType.startsWith('image')) {
		return 'image';
	} else if (mimeType.startsWith('video')) {
		return 'video';
	} else if (mimeType.startsWith('audio')) {
		return 'audio';
	} else if (mimeType.startsWith('application/pdf')) {
		return 'PDF';
	}
	return 'file';
}

export function downloadBlob(blob: Blob, filename: string = 'download', mimeType: string) {
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	const ext = getFileType(mimeType);
	a.download = `${filename}.${ext}`;
	a.click();
	window.URL.revokeObjectURL(url);
}
