import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export class EmailService {
  private transporter: Transporter;

  constructor() {
    // Configuration du transporteur d'email
    // En développement, utiliser un service comme Ethereal ou Mailtrap
    // En production, utiliser un vrai service SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true pour 465, false pour les autres ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Envoie un email de confirmation d'activation des notifications
   */
  async sendNotificationActivationEmail(
    email: string,
    username: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"FocusTask" <noreply@focustask.com>',
      to: email,
      subject: 'Notifications activées - FocusTask',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 Notifications activées</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${username} !</h2>
              <p>Vous avez activé les notifications sur FocusTask.</p>
              <p>Vous recevrez désormais des notifications pour :</p>
              <ul>
                <li>Les rappels de tâches à venir</li>
                <li>Les tâches en retard</li>
                <li>Les succès débloqués</li>
                <li>Les récompenses obtenues</li>
              </ul>
              <p>Vous pouvez modifier vos préférences de notifications à tout moment depuis les paramètres de votre compte.</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings" class="button">
                Gérer mes paramètres
              </a>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement par FocusTask.</p>
              <p>Si vous n'avez pas activé les notifications, veuillez nous contacter immédiatement.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Bonjour ${username} !

Vous avez activé les notifications sur FocusTask.

Vous recevrez désormais des notifications pour :
- Les rappels de tâches à venir
- Les tâches en retard
- Les succès débloqués
- Les récompenses obtenues

Vous pouvez modifier vos préférences de notifications à tout moment depuis les paramètres de votre compte.

Cet email a été envoyé automatiquement par FocusTask.
Si vous n'avez pas activé les notifications, veuillez nous contacter immédiatement.
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Envoie un email de désactivation des notifications
   */
  async sendNotificationDeactivationEmail(
    email: string,
    username: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || '"FocusTask" <noreply@focustask.com>',
      to: email,
      subject: 'Notifications désactivées - FocusTask',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #757575;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔕 Notifications désactivées</h1>
            </div>
            <div class="content">
              <h2>Bonjour ${username},</h2>
              <p>Vous avez désactivé les notifications sur FocusTask.</p>
              <p>Vous ne recevrez plus de notifications par email.</p>
              <p>Vous pouvez réactiver les notifications à tout moment depuis les paramètres de votre compte.</p>
            </div>
            <div class="footer">
              <p>Cet email a été envoyé automatiquement par FocusTask.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Bonjour ${username},

Vous avez désactivé les notifications sur FocusTask.

Vous ne recevrez plus de notifications par email.

Vous pouvez réactiver les notifications à tout moment depuis les paramètres de votre compte.
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}

export default new EmailService();
