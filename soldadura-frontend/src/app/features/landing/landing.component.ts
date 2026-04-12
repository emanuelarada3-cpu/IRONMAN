import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  AfterViewInit,
  ElementRef,
  ViewChild,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SettingsService } from '../../core/services/settings.service';
import { AuthService } from '../../core/services/auth.service';
import { BusinessSettings } from '../../core/models/models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroCanvas') heroCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('mapContainer') mapContainerRef!: ElementRef<HTMLDivElement>;

  private settingsService = inject(SettingsService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  settings = signal<BusinessSettings>({});
  isLoggedIn = this.auth.isLoggedIn;
  userRole = this.auth.userRole;

  mobileMenuOpen = signal(false);
  isScrolled = false;
  countersStarted = false;
  private animFrame: number | null = null;
  private particles: any[] = [];
  private mapInstance: any = null;
  private observer: IntersectionObserver | null = null;

  services = [
    {
      icon: '⚡',
      title: 'Soldadura MIG/MAG',
      desc: 'Proceso de alta velocidad ideal para acero, aluminio y acero inoxidable con resultados impecables.',
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80',
    },
    {
      icon: '🔥',
      title: 'Soldadura TIG',
      desc: 'Precisión extrema para trabajos delicados. Perfecta para juntas críticas y materiales de alta exigencia.',
      image: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=600&q=80',
    },
    {
      icon: '🏗️',
      title: 'Estructuras Metálicas',
      desc: 'Fabricación e instalación de estructuras para construcción, industria y comercio.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    },
    {
      icon: '🚗',
      title: 'Soldadura Automotriz',
      desc: 'Reparación de carrocerías, chasis y componentes metálicos de vehículos.',
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
    },
    {
      icon: '🔩',
      title: 'Fabricación a Medida',
      desc: 'Puertas, rejas, escaleras, marcos y cualquier pieza metálica según tu diseño.',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    },
    {
      icon: '🛡️',
      title: 'Mantenimiento Industrial',
      desc: 'Reparación y mantenimiento preventivo de equipos y maquinaria industrial.',
      image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?w=600&q=80',
    },
  ];

  ngOnInit() {
    this.settingsService.getPublic().subscribe({
      next: (s) => this.settings.set(s),
      error: () => {},
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      import('aos').then((AOS) => {
        AOS.default.init({ duration: 700, easing: 'ease-out-cubic', once: true });
      });
      this.initSparks();
      this.initCounterObserver();
      this.initScrollListener();
      setTimeout(() => this.initMap(), 300);
    }
  }

  private initScrollListener() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
  }

  private initSparks() {
    const canvas = this.heroCanvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    this.particles = Array.from({ length: 60 }, () => this.createParticle(canvas));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.012;
        p.vy -= 0.06;
        p.size *= 0.97;

        if (p.life <= 0) {
          this.particles[i] = this.createParticle(canvas);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      this.animFrame = requestAnimationFrame(animate);
    };
    this.zone.runOutsideAngular(() => animate());
  }

  private createParticle(canvas: HTMLCanvasElement) {
    const colors = ['#e67e22', '#f39c12', '#fff', '#ffd700', '#ff6b35'];
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 2.5,
      vy: -(Math.random() * 2 + 1),
      size: Math.random() * 2.5 + 0.5,
      life: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  private initCounterObserver() {
    const section = document.querySelector('.stats-section');
    if (!section) return;
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.countersStarted) {
          this.countersStarted = true;
          this.animateCounters();
        }
      },
      { threshold: 0.3 },
    );
    this.observer.observe(section);
  }

  private animateCounters() {
    document.querySelectorAll('.counter-num').forEach((el) => {
      const target = el.getAttribute('data-target') || '0';
      const hasPlus = target.includes('+');
      const hasPercent = target.includes('%');
      const num = parseInt(target.replace(/[^0-9]/g, ''));
      let current = 0;
      const step = Math.ceil(num / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, num);
        el.textContent = current + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
        if (current >= num) clearInterval(timer);
      }, 30);
    });
  }

  private async initMap() {
    const container = this.mapContainerRef?.nativeElement;
    if (!container) return;
    const s = this.settings();
    const lat = parseFloat(s.business_lat || '20.9666');
    const lng = parseFloat(s.business_lng || '-76.9511');

    const L = await import('leaflet');
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
    container.innerHTML = '';

    this.mapInstance = L.map(container, { scrollWheelZoom: false }).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.mapInstance);

    const icon = L.divIcon({
      className: '',
      html: `<div style="background:linear-gradient(135deg,#e67e22,#d35400);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 15px rgba(230,126,34,0.6)"></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
    L.marker([lat, lng], { icon })
      .addTo(this.mapInstance)
      .bindPopup(
        `<b>${s.business_name || 'IronMan'}</b><br>${s.business_address || 'Las Tunas, Cuba'}`,
      )
      .openPopup();
  }

  toggleMenu() {
    this.mobileMenuOpen.update((v) => {
      const isOpen = !v;
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return isOpen;
    });
  }

  closeMenu() {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  goToDashboard() {
    const role = this.auth.userRole();
    if (role) this.router.navigate([this.auth.getRedirectPath(role)]);
  }

  get whatsappLink(): string {
    const n = this.settings().whatsapp || '';
    return n ? `https://wa.me/${n.replace(/\D/g, '')}` : '#';
  }

  ngOnDestroy() {
    if (this.animFrame !== null) cancelAnimationFrame(this.animFrame);
    if (this.observer) this.observer.disconnect();
    if (this.mapInstance) this.mapInstance.remove();
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
