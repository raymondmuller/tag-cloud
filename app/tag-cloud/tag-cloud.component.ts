import {Component, OnInit, EventEmitter} from 'angular2/core';
import {Tag} from './tag';
import {TagCloud} from './tag-cloud';
import {TagBadgeComponent} from './tag-badge.component';
import {TagCloudService} from './tag-cloud.service';

@Component({
	selector: 'tag-cloud',
	template: `
		<div *ngIf="tagCloud">
			<div>{{tagCloud.max}} - {{sizeRatio}}</div>
			<div [style.width]="'100%'">
				<tag-badge *ngFor="#tag of tagCloud.tags" [tag]="tag" [sizeRatio]="sizeRatio" [showSize]="showSize" (selected)="onTagSelected($event)"></tag-badge>
			</div>
		</div>
	`,
	inputs: ['text', 'maxWords', 'highlightFunction', 'ignoreFunction', 'maxSizeRatio','showSize'],
	outputs: ['selectedTag'],
	directives: [TagBadgeComponent],
	providers: [TagCloudService]
})
export class TagCloudComponent implements OnInit {
	public text: string;
	public maxWords: number = 20;
	public highlightFunction: (word: string) => boolean;
	public ignoreFunction: (word: string) => boolean;
	public showSize: boolean = true;
	public maxSizeRatio: number = 5;
	public selectedTag:EventEmitter<string> = new EventEmitter<string>();

	public tagCloud: TagCloud;
	public sizeRatio: number = 10;

	constructor(private _tagCloudService: TagCloudService) {}

	ngOnInit() {
		this._tagCloudService.getTagCloudF(this.text, this.maxWords, this.highlightFunction, this.ignoreFunction).then(tagCloud => {
			this.tagCloud = tagCloud;
			this.sizeRatio = (this.maxSizeRatio * 100 - 100) / (this.tagCloud.max - 1);
		});
	}
	
	onTagSelected(tag :Tag ){
		this.selectedTag.emit(tag.name);
	}
}