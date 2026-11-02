// ==========================================
// NAYYAH NAVIGATOR CORE (Offline-First)
// ==========================================

class NayyahNavigator {
    constructor() {
        this.currentHeading = 0; // Arah hadap HP (derajat)
        this.targetBearing = 0;  // Arah ke titik kumpul (derajat)
        this.isCalibrated = false;
        
        // Inisialisasi sensor kompas/giroskop
        this.initCompass();
    }

    // 1. Mengaktifkan Sensor Orientasi Perangkat
    initCompass() {
        if (window.DeviceOrientationEvent) {
            // Untuk iOS 13+ perlu izin khusus, untuk Android langsung jalan
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                // iOS Logic (akan kita handle nanti jika butuh tombol izin)
                console.log("iOS detected, permission needed");
            } else {
                window.addEventListener('deviceorientation', (e) => {
                    // alpha = arah kompas (0-360 derajat)
                    this.currentHeading = e.alpha || 0;
                    this.updateArrowRotation();
                });
            }
        } else {
            document.getElementById('voice-indicator').innerText = "⚠️ Kompas tidak didukung";
        }
    }

    // 2. Menghitung Selisih Arah & Memutar Panah Visual
    updateArrowRotation() {
        const arrow = document.getElementById('direction-arrow');
        if (!arrow) return;

        // Rumus: Rotasi Panah = Target - Heading Saat Ini
        let rotation = this.targetBearing - this.currentHeading;
        
        // Terapkan rotasi ke elemen HTML
        arrow.style.transform = `rotate(${rotation}deg)`;
        
        // Update teks jarak (simulasi statis dulu, nanti dinamis via GPS/QR)
        const distLabel = document.getElementById('distance-label');
        if(distLabel) distLabel.innerText = "Ikuti Panah Hijau";
    }

    // 3. Set Target Titik Kumpul (Nanti diambil dari landmarks.json)
    setTargetAssemblyPoint(bearingDegrees) {
        this.targetBearing = bearingDegrees;
        this.updateArrowRotation();
        
        // Beri feedback suara saat target berubah
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance("Arahkan ke titik kumpul");
            msg.lang = 'id-ID';
            window.speechSynthesis.speak(msg);
        }
    }

    // 4. Fungsi Scan QR Landmark (Placeholder untuk langkah berikutnya)
    async scanLandmark(qrData) {
        try {
            const data = JSON.parse(qrData);
            console.log("Landmark terdeteksi:", data.zone);
            // Di sini nanti logika koreksi posisi & update targetBearing
            this.setTargetAssemblyPoint(data.bearingToAssembly);
        } catch (e) {
            console.error("QR Invalid");
        }
    }
}

// Inisialisasi Global saat Script Dimuat
const nayyahNav = new NayyahNavigator();
