import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-dialog-datos-bancarios',
  templateUrl: './dialog-datos-bancarios.component.html',
  styleUrls: ['./dialog-datos-bancarios.component.scss']
})
export class DialogDatosBancariosComponent {

  constructor(
    private clipboard: Clipboard
  ) {}
  lifetimeAchievements: string = '';

  copyCBU() {
    this.clipboard.copy('0110325820032500438418');
  }

  copyDatosBancarios() {
    this.lifetimeAchievements =
    `Banco Nación Argentina` + "\n" +
    `Tipo de cuenta: Cuenta Corriente` + "\n" +
    `Número de Cuenta: 22003250043841` + "\n" +
    `Número CUIT: 30709364363` + "\n" +
    `Número de CBU: 0110325820032500438418`;

    const pending = this.clipboard.beginCopy(this.lifetimeAchievements);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        pending.destroy();
      }
    };
    attempt();
  }
}
