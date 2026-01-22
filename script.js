// Smooth scroll helper
function scrollToSection(sel){
  const el=document.querySelector(sel);
  if(!el) return;
  el.scrollIntoView({behavior:'smooth',block:'start'});
}

// Mobile menu toggle
function toggleMobile(){
  const menu=document.getElementById('mobile-menu');
  const btn=document.querySelector('.hambtn');
  if(menu.style.display==='none' || menu.style.display===''){
    menu.style.display='block'; btn.setAttribute('aria-expanded','true');
  } else {
    menu.style.display='none'; btn.setAttribute('aria-expanded','false');
  }
}

// ============================================
// BOOKING FORM - Service Selection with Total
// ============================================
function updateBookingTotal() {
  const checkboxes = document.querySelectorAll('.service-checkbox-item input[type="checkbox"]');
  let total = 0;

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const price = Number(checkbox.dataset.price) || 0;
      const qtyInput = checkbox.closest('.service-checkbox-item').querySelector('.service-qty');
      const qty = Number(qtyInput.value) || 1;
      total += price * qty;
    }
  });

  const totalEl = document.querySelector('.booking-total-amount');
  totalEl.textContent = '₹' + total.toLocaleString('en-IN');
}

// Initialize booking service checkboxes
document.querySelectorAll('.service-checkbox-item').forEach(item => {
  const checkbox = item.querySelector('input[type="checkbox"]');
  const qtyInput = item.querySelector('.service-qty');

  // Initially disable qty input if checkbox not checked
  qtyInput.disabled = !checkbox.checked;

  // When checkbox changes
  checkbox.addEventListener('change', () => {
    qtyInput.disabled = !checkbox.checked;
    if (!checkbox.checked) {
      qtyInput.value = 1; // Reset to 1 when unchecked
    }
    updateBookingTotal();
  });

  // When quantity changes
  qtyInput.addEventListener('input', () => {
    if (qtyInput.value < 1) qtyInput.value = 1;
    updateBookingTotal();
  });
});

// Initial booking total calculation
updateBookingTotal();

// Booking form -> download .txt
document.getElementById('booking-form').addEventListener('submit', function(e){
  e.preventDefault();
  const form = e.target;
  
  // Get selected services
  const selectedServices = [];
  const checkboxes = document.querySelectorAll('.service-checkbox-item input[type="checkbox"]:checked');
  checkboxes.forEach(checkbox => {
    const item = checkbox.closest('.service-checkbox-item');
    const qtyInput = item.querySelector('.service-qty');
    const serviceName = checkbox.value;
    const price = checkbox.dataset.price;
    const qty = qtyInput.value;
    selectedServices.push(`${serviceName} x${qty} (₹${price} each)`);
  });

  const data = {
    Name: form.name.value.trim(),
    Email: form.email.value.trim(),
    Phone: form.phone.value.trim(),
    'Pet Category': form.pet.value,
    'Selected Services': selectedServices.length > 0 ? selectedServices.join(', ') : 'None',
    Date: form.date.value,
    Time: form.time.value
  };

  let content = '--- FurryFriend Service Booking ---\n';
  for(const k in data){ 
    if (k === 'Selected Services') {
      content += `${k}:\n`;
      selectedServices.forEach(s => content += `  - ${s}\n`);
    } else {
      content += `${k}: ${data[k]}\n`; 
    }
  }
  content += '-----------------------------------\n';
  content += `Total Cost: ${document.querySelector('.booking-total-amount').textContent}\n`;

  const blob = new Blob([content], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'furryfriend_booking.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
  alert('Booking details downloaded as furryfriend_booking.txt');
  form.reset();
  
  // Reset checkboxes and update total
  document.querySelectorAll('.service-checkbox-item input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
    const item = cb.closest('.service-checkbox-item');
    const qtyInput = item.querySelector('.service-qty');
    qtyInput.disabled = true;
    qtyInput.value = 1;
  });
  updateBookingTotal();
});

// Feedback form -> download .txt
document.getElementById('feedback-form').addEventListener('submit', function(e){
  e.preventDefault();
  const form = e.target;
  const rating = form.rating.value;
  const data = {
    Name: form['review-name'].value.trim(),
    Email: form['review-email'].value.trim(),
    Rating: rating + ' stars',
    Review: form['review-text'].value.trim()
  };

  let content = '--- FurryFriend Customer Feedback ---\n';
  for(const k in data){ content += `${k}: ${data[k]}\n`; }
  content += '-------------------------------------\n';
  content += `Submitted on: ${new Date().toLocaleString()}\n`;

  const blob = new Blob([content], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'furryfriend_feedback.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
  alert('Thank you for your feedback! Your review has been saved.');
  form.reset();
});

// small UX improvement: prefill today's date
(function setToday(){
  const dateEl = document.getElementById('date');
  if(dateEl && !dateEl.value){
    const d = new Date();
    const iso = d.toISOString().slice(0,10);
    dateEl.value = iso;
  }
})();