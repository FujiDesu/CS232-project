   document.getElementById('login-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const userId = document.getElementById('userId').value;
      const password = document.getElementById('password').value;
      const errorMessage = document.getElementById('error-message');
      
      try {
        // แสดงข้อความกำลังโหลด
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#ffffff';
        errorMessage.style.background = 'rgba(0, 0, 255, 0.2)';
        errorMessage.textContent = "กำลังเข้าสู่ระบบ...";
        
        // เรียก API เพื่อล็อกอิน
        const apiUrl = `https://ozz8snl197.execute-api.us-east-1.amazonaws.com/prod/login`;
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // บันทึกข้อมูลการล็อกอินใน localStorage
          localStorage.setItem('token', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
          
          // แสดงข้อความสำเร็จก่อนนำทาง
          errorMessage.style.color = '#4CAF50';
          errorMessage.style.background = 'rgba(76, 175, 80, 0.1)';
          errorMessage.textContent = "เข้าสู่ระบบสำเร็จ! กำลังนำทาง...";
          
          // นำทางไปหน้าที่เหมาะสมตาม role
          setTimeout(() => {
            if (data.user.role === 'student') {
              window.location.href = "student-dashboard.html";
            } else if (data.user.role === 'advisor') {
              window.location.href = "advisor-dashboard.html";
            } else {
              errorMessage.style.color = '#ff6b6b';
              errorMessage.style.background = 'rgba(255, 0, 0, 0.1)';
              errorMessage.textContent = "ไม่สามารถระบุประเภทผู้ใช้งานได้";
            }
          }, 1000); // รอ 1 วินาที
          
        } else {
          // แสดงข้อความผิดพลาดจาก API
          errorMessage.style.color = '#ff6b6b';
          errorMessage.style.background = 'rgba(255, 0, 0, 0.1)';
          errorMessage.textContent = data.message || "รหัสผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
        }
      } catch (error) {
        console.error('Login error:', error);
        // แสดงข้อความผิดพลาดในการเชื่อมต่อ
        errorMessage.style.color = '#ff6b6b';
        errorMessage.style.background = 'rgba(255, 0, 0, 0.1)';
        errorMessage.style.display = 'block';
        errorMessage.textContent = "เกิดข้อผิดพลาดในการเชื่อมต่อ";
      }
    });