import { Task } from './../models/task';
export class Services {
	async saveTasksSVC(tasks: Task[]): Promise<void> {
		try {
			localStorage.setItem('JSONTasks', JSON.stringify(tasks));
		} catch (error) {
			console.error(error);
		}
	}
	async getTasksSVC(): Promise<any[]> {
		let result: string;
		let data: any[] = [];
		try {
			result = await localStorage.getItem('JSONTasks');
			data = JSON.parse(result);
			return data;
		} catch (error) {
			console.error(error);
		}
	}
}
