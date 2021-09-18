import { ViewModel } from './../viewModel/viewModel';
import { Services } from '../services/services';

const svc = new Services();

let dataDB: Task[] = [];

export class Task {
	nameTask: string;
	descriptionTask: string;
	isFinished: boolean;
	dateLimit: Date;

	constructor() {
		this.nameTask = '';
		this.descriptionTask = '';
		this.isFinished = false;
		this.dateLimit = new Date();
	}

	formViewToDB(arrayVM: ViewModel[]): void {
		try {
			let tasks: Task[] = [];
			arrayVM.forEach((itemVM: ViewModel) => {
				let task = new Task();
				task.nameTask = itemVM.title_Observable;
				task.descriptionTask = itemVM.description_Observable;
				task.dateLimit = itemVM.dateLimit_Observable;
				task.isFinished = itemVM.isFinished_Observable;
				tasks.push(task);
			});
			svc.saveTasksSVC(tasks);
		} catch (error) {
			console.error(error);
		}
	}

	async fromDBToView(): Promise<ViewModel[]> {
		try {
			let vmArray: ViewModel[] = [];
			dataDB = [];
			dataDB = await svc.getTasksSVC();
			dataDB = dataDB === null ? [] : dataDB;
			dataDB.forEach((itemTask: Task) => {
				let vmItem: any = {
					title_Observable: itemTask.nameTask,
					description_Observable: itemTask.descriptionTask,
					dateLimit_Observable: itemTask.dateLimit,
					isFinished_Observable: itemTask.isFinished
				};
				vmArray.push(vmItem);
			});
			return vmArray;
		} catch (error) {
			console.error(error);
		}
	}

	async deleteTask(idItem: number): Promise<void> {
		dataDB.splice(idItem, 1);
		svc.saveTasksSVC(dataDB);
	}

	async editTask(idItem: number, item: ViewModel): Promise<void> {
		dataDB[idItem].nameTask = item.title_Observable;
		dataDB[idItem].descriptionTask = item.description_Observable;
		dataDB[idItem].dateLimit = item.dateLimit_Observable;
		dataDB[idItem].isFinished = item.isFinished_Observable;
		svc.saveTasksSVC(dataDB);
	}
}
