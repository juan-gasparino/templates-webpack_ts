import { Task } from '../models/task';
import { Templates } from '../templates/templates';

const tmp = new Templates();
const tsk = new Task();

let arrayVM: ViewModel[] = [];

export class ViewModel {
	title_Observable: string;
	description_Observable: string;
	isFinished_Observable: boolean;
	dateLimit_Observable: Date;

	constructor(item?: ViewModel) {
		this.title_Observable = item != null ? item.title_Observable : '';
		this.description_Observable = item != null ? item.description_Observable : '';
		this.isFinished_Observable = item != null ? item.isFinished_Observable : false;
		this.dateLimit_Observable = item != null ? item.dateLimit_Observable : new Date();
	}

	init(): void {
		try {
			this.bindElementsVanilla();
			this.showTasks();
		} catch (error) {
			console.error(error);
		}
	}

	bindElementsVanilla(): void {
		document.querySelector('#app').addEventListener('input', e => {
			this.handleInputChange(e);
		});
		document.querySelector('#app').addEventListener('click', e => {
			this.handleInputClick(e);
		});
	}

	handleInputChange(e: any): void {
		switch (e.target.attributes.id.value) {
			case 'title_Observable_create':
				this.title_Observable = e.target.value;
				break;
			case 'description_Observable_create':
				this.description_Observable = e.target.value;
				break;
			case 'isFinished_Observable_create':
				this.isFinished_Observable = e.target.checked;
				break;
			case 'dateLimit_Observable_create':
				this.dateLimit_Observable = e.target.value;
				break;
			default:
				break;
		}
	}

	handleInputClick(e: any): void {
		switch (e.target.id) {
			case 'isFinished_Observable_create':
				this.handleInputChange(e);
				break;
			case 'dateLimit_Observable_create':
				this.handleInputChange(e);
				break;
			case 'btn_add':
				this.pushItems(this);
				e.preventDefault();
				break;
			case 'btn_submit':
				this.saveItems();
				e.preventDefault();
				break;
			case 'btn_item-buttons-edit':
				this.showEditForm(+e.target.parentElement.parentElement.attributes.key.value);
				break;
			case 'btn_item-buttons-delete':
				this.deleteItem(+e.target.parentElement.parentElement.attributes.key.value);
				break;
			case 'btn_updateItem':
				this.editItem(+e.target.parentElement.parentElement.attributes.key.value, this);
				break;
			case 'btn_cancelUpdateItem':
				this.removeHtml('modalForm');
				break;
		}
	}

	async showTasks(): Promise<void> {
		try {
			this.removeHtml('item');
			arrayVM = await tsk.fromDBToView();
			arrayVM.forEach((itemVM: ViewModel, index: number) => {
				const listItem: string = tmp.createListItemVM(index, itemVM);
				this.renderItem('list_show', listItem);
			});
		} catch (error) {
			console.error(error);
		}
	}

	private renderItem(fatherId: string, childItemHtmlString: string): void {
		try {
			document.getElementById(fatherId).innerHTML += childItemHtmlString;
		} catch (error) {
			console.error(error);
		}
	}

	private removeHtml(idTag: string): void {
		try {
			if (document.getElementById(idTag) != null) {
				document.getElementById(idTag).remove();
			} else {
				let items = document.getElementsByClassName(idTag);
				while (items.length > 0) {
					items[0].parentNode.removeChild(items[0]);
				}
			}
		} catch (error) {
			console.error(error);
		}
	}

	pushItems(obj: any): void {
		try {
			const item: any = {
				title_Observable: obj.title_Observable,
				description_Observable: obj.description_Observable,
				dateLimit_Observable: obj.dateLimit_Observable,
				isFinished_Observable: obj.isFinished_Observable
			};
			arrayVM.push(item);
		} catch (error) {
			console.error(error);
		}
	}

	saveItems(): void {
		try {
			tsk.formViewToDB(arrayVM);
			this.showTasks();
			arrayVM = [];
		} catch (error) {
			console.error(error);
		}
	}

	async deleteItem(idItem: number): Promise<void> {
		try {
			await tsk.deleteTask(idItem);
			this.showTasks();
		} catch (error) {
			console.error(error);
		}
	}

	async editItem(idItem: number, obj: any): Promise<void> {
		try {
			const item: any = {
				title_Observable: obj.title_Observable,
				description_Observable: obj.description_Observable,
				dateLimit_Observable: obj.dateLimit_Observable,
				isFinished_Observable: obj.isFinished_Observable
			};
			await tsk.editTask(idItem, item);
			this.removeHtml('modalForm');
			this.showTasks();
		} catch (error) {
			console.error(error);
		}
	}

	async showEditForm(idItem: number): Promise<void> {
		try {
			arrayVM = [];
			arrayVM = await tsk.fromDBToView();
			const itemVM = arrayVM[idItem];
			const htmlEditForm = tmp.createEditFormVM(idItem, itemVM);
			this.renderItem('app', htmlEditForm);
		} catch (error) {
			console.error(error);
		}
	}
}
