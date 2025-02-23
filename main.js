const ssidInput = document.getElementById('ssid');
      const passwordInput = document.getElementById('password');
      const generateButton = document.getElementById('generate');
      const qrContainer = document.getElementById('qr-container');
      const qrCanvas = document.getElementById('qr-code');
      const qrPlaceholder = document.getElementById('qr-placeholder');
      const downloadButton = document.getElementById('download');

      function generateWifiString(ssid, password) {
        return `WIFI:T:WPA;S:${ssid};P:${password};;`;
      }

      function downloadQRCode() {
        const link = document.createElement('a');
        const networkName = ssidInput.value.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `wifi_${networkName}_qr.png`;
        link.href = qrCanvas.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      async function generateQRCode() {
        const ssid = ssidInput.value.trim();
        const password = passwordInput.value.trim();

        if (!ssid || !password) {
          alert('Please enter both SSID and password');
          return;
        }

        try {
          const wifiString = generateWifiString(ssid, password);
          QRCode.toCanvas(qrCanvas, wifiString, {
            width: 256,
            margin: 1,
            color: {
              dark: '#1E293B',
              light: '#FFFFFF'
            }
          });
          qrPlaceholder.style.display = 'none';
          qrCanvas.style.display = 'block';
          downloadButton.style.display = 'block';

          generateButton.style.transform = 'scale(0.95)';
          setTimeout(() => {
            generateButton.style.transform = 'scale(1)';
          }, 150);
        } catch (error) {
          console.error('Error generating QR code:', error);
          alert('Error generating QR code. Please try again.');
        }
      }

      generateButton.addEventListener('click', generateQRCode);
      downloadButton.addEventListener('click', downloadQRCode);

      [ssidInput, passwordInput].forEach(input => {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            generateQRCode();
          }
        });

        input.addEventListener('focus', () => {
          input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
          input.parentElement.classList.remove('focused');
        });
      });