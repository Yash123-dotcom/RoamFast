
export class EmailService {
    private async sendEmail(to: string, subject: string, html: string) {
        // In production, use NodeMailer or Resend here.
        console.log(`
    ==================================================
    [MOCK EMAIL SERVICE]
    To: ${to}
    Subject: ${subject}
    --------------------------------------------------
    ${html.replace(/<br>/g, '\n').replace(/<\/?[^>]+(>|$)/g, "")} 
    --------------------------------------------------
    [END EMAIL]
    ==================================================
    `);
        return true;
    }

    async sendBookingConfirmation(userEmail: string, userName: string, bookingDetails: any) {
        const subject = `Booking Confirmed: ${bookingDetails.hotelName}`;
        const html = `
      <h1>Booking Confirmed!</h1>
      <p>Hi ${userName},</p>
      <p>Your stay at <strong>${bookingDetails.hotelName}</strong> is confirmed.</p>
      <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
        <p><strong>Check-in:</strong> ${new Date(bookingDetails.checkIn).toDateString()}</p>
        <p><strong>Check-out:</strong> ${new Date(bookingDetails.checkOut).toDateString()}</p>
        <p><strong>Total Price:</strong> ₹${bookingDetails.totalPrice}</p>
        <p><strong>Booking ID:</strong> ${bookingDetails.id}</p>
      </div>
      <p>We look forward to hosting you!</p>
      <p>The NeonStay Team</p>
    `;
        await this.sendEmail(userEmail, subject, html);
    }

    async sendHotelApprovalNotification(ownerEmail: string, ownerName: string, hotelName: string) {
        const subject = `Good News! ${hotelName} is Live 🎉`;
        const html = `
      <h1>Property Approved</h1>
      <p>Hi ${ownerName},</p>
      <p>Congratulations! Your property <strong>${hotelName}</strong> has been approved by our admin team.</p>
      <p>It is now live on NeonStay and ready to accept bookings.</p>
      <p>Go to your dashboard to manage your availability.</p>
      <br>
      <a href="http://localhost:3000/owner/dashboard">Go to Dashboard</a>
    `;
        await this.sendEmail(ownerEmail, subject, html);
    }

    async sendNewBookingNotification(ownerEmail: string, hotelName: string, amount: number) {
        const subject = `New Booking for ${hotelName}! 💰`;
        const html = `
      <h1>New Revenue!</h1>
      <p>You have received a new booking for <strong>${hotelName}</strong>.</p>
      <p><strong>Payout Amount:</strong> ₹${amount}</p>
      <p>Check your dashboard for details.</p>
    `;
        await this.sendEmail(ownerEmail, subject, html);
    }
}

export default new EmailService();
