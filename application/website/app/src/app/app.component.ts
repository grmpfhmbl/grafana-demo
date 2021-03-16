import {Component} from '@angular/core';
import {fromLonLat} from 'ol/proj';
import {Coordinate} from 'ol/coordinate';
import {MatSliderChange} from '@angular/material/slider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'DockerDemo';

  center: Coordinate = fromLonLat([15, 47.2]);
  zoom = 9;
  timeout: number | null = 0;

  timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // intentionally empty
  }

  private setNewCenter(): void {
    this.zoom = 9 + 6 * Math.random();

    this.center = fromLonLat([
      13.563348 + (16.171760 - 13.563348) * Math.random(),
      46.611987 + (47.827890 - 46.611987) * Math.random()
    ]);

    if (this.timeout !== null && this.timeout > 0) {
      clearTimeout(this.timer); // just to be sure that the current timer gets killed when someone calls this directly

      this.timer = setTimeout(() => {
        this.setNewCenter();
      }, this.timeout * 1000);
    }
  }

  matSliderChanges(matSliderChange: MatSliderChange): void {
    console.log('this.timer', this.timer);
    clearTimeout(this.timer);
    if (matSliderChange !== null && matSliderChange.value !== null
        && matSliderChange.value > 0) {
      this.timer = setTimeout(() => {
        this.setNewCenter();
      }, 0);
    }
  }
}
