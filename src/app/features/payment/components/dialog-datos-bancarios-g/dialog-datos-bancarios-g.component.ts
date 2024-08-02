import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-dialog-datos-bancarios-g',
  templateUrl: './dialog-datos-bancarios-g.component.html',
  styleUrls: ['./dialog-datos-bancarios-g.component.scss']
})
export class DialogDatosBancariosGComponent {
  constructor(
    private clipboard: Clipboard
  ) {}
  lifetimeAchievements: string = '';

  copyCBU() {
    this.clipboard.copy('0070177420000005118353');
  }

  copyDatosBancarios() {
    this.lifetimeAchievements =
    `Banco Galicia` + "\n" +
    `Tipo de cuenta: Cuenta Corriente` + "\n" +
    `Número de Cuenta: 511831775` + "\n" +
    `Número CUIT: 30709364363` + "\n" +
    `Número de CBU: 0070177420000005118353` + "\n" +
    `Alias: NOGAL.REPTIL.PEZ`;

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
