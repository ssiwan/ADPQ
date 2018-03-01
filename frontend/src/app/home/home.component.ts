import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Angular2TokenService } from "angular2-token";
import { Router, RouterLink } from '@angular/router';
import { StepService } from '../services/step.service';
import { ArticleService} from '../services/article.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public fileSubmissionCount;

  constructor(private cdr: ChangeDetectorRef,
    public authTokenService: Angular2TokenService,
    public authService: AuthService,
    public stepService: StepService,
    public articleService: ArticleService) {}

  @ViewChild('modal') modal: ModalComponent;

  presentModal(mode) {
    this.modal.openModal(mode);
  }

  refreshFileSubmissions() {
    this.articleService.getFileSubmissions().subscribe(data => {
      this.modal.fileSubmissions = data.json();
      this.fileSubmissionCount = this.modal.fileSubmissions.length;
    })
  }

  ngOnInit() {    
    this.cdr.detectChanges();
    this.authService.isLoggedIn();
    this.cdr.detectChanges();
    this.stepService.getWorkflowSteps();
    this.refreshFileSubmissions();
    this.modal.fileActions.subscribe(evt => {
      switch (evt.action) {
        case 'approve': {
          this.articleService.approveFileAttachment(evt).subscribe(() => {
            this.refreshFileSubmissions()
          });
          break;
        }
        case 'reject': {
          this.articleService.removeFileAttachment(evt).subscribe(() => {
            this.refreshFileSubmissions()
          });
          break;
        }
      }
    });
  }   

   hasRole(roleName) {
    let userHasRole = false;
    if (this.authTokenService.currentUserData && this.authTokenService.currentUserData['roles'].length != 0) {
      userHasRole = this.authTokenService.currentUserData['roles'].some(r => r.name == roleName);
    }
    return userHasRole;
  }

}
