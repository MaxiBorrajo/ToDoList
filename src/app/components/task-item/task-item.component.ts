import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { TASKS } from 'src/app/mock-task';
import { Task } from 'src/app/task';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router';
import { TaskService } from 'src/app/service/task.service';
import { coerceStringArray } from '@angular/cdk/coercion';
@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent implements OnInit {
  @Input() task:Task = TASKS[0];
  @Output() onDeleteTask: EventEmitter<Task> = new EventEmitter()
  constructor(private renderer: Renderer2, private router:Router, private taskService: TaskService) { 
  }
  ngOnInit(): void {
    this.isChecked = this.task.completed
  }
  today = this.taskService.today;
  faTrashCan = faTrashCan
  faPenToSquare = faPenToSquare
  isChecked:boolean = false;
  
  checked(task:Task){
    this.isChecked = !this.isChecked;
    this.task.completed = this.isChecked;
    this.taskService.updateCompleted(task).subscribe(resp=>{
      console.log('good')
    });
  }
  onDelete(task:Task){
    this.onDeleteTask.emit(task);
  }

  expireDate(){
    return new Date(this.task.expire)
  }

  equal(){
    let expire = this.expireDate()
    return ((this.today.getFullYear() == expire.getFullYear()) &&
    (this.today.getMonth() == expire.getMonth()) &&
    (this.today.getDate() == expire.getDate()))
  }

  isLate(){
    let daysLateMs = Number(this.today) - Number(this.expireDate())
    let oneDayMs = 86400000
    let daysLate = daysLateMs/oneDayMs
    return daysLate > 1
  }

  daysLate(){
    let daysLateMs = Number(this.today) - Number(this.expireDate())
    let oneDayMs = 86400000
    let daysLate = Math.round(daysLateMs/oneDayMs)
    return daysLate
  }

  goToEditTask(task:Task){
    this.router.navigate(['/editTask', task.id]);
  }
 }
