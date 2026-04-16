import bcrypt from 'bcryptjs';

const ADMIN_ACCOUNT = {
  name: 'Pixel Admin',
  email: 'admin@dcg-event.local',
  password: 'Admin12345!'
};

const CUSTOMER_ACCOUNT = {
  name: 'Demo Customer',
  email: 'customer@dcg-event.local',
  password: 'Customer12345!'
};

const DEMO_EVENTS = [
  {
    title: 'Block Drop Championship',
    description: 'Stack and clear lines in our retro speed challenge.',
    location: 'Arcade Hall A',
    date: '2026-05-11 19:30',
    capacity: 64
  },
  {
    title: 'Neon Grid Night',
    description: 'Community mixer with pixel art booths and synth tunes.',
    location: 'Downtown Retro Arena',
    date: '2026-05-18 18:00',
    capacity: 120
  },
  {
    title: '8-Bit Builders Meetup',
    description: 'Show-and-tell for indie creators building game-inspired tools.',
    location: 'Lab 7, Innovation Hub',
    date: '2026-06-02 17:45',
    capacity: 80
  }
];

export async function seedDemoData(authRepository, eventsRepository) {
  let admin = await authRepository.findUserByEmail(ADMIN_ACCOUNT.email);

  if (!admin) {
    const passwordHash = await bcrypt.hash(ADMIN_ACCOUNT.password, 10);
    admin = await authRepository.createUser({
      name: ADMIN_ACCOUNT.name,
      email: ADMIN_ACCOUNT.email,
      passwordHash,
      role: 'admin'
    });
  }

  const existing = await eventsRepository.listEvents();
  if (existing.length === 0) {
    for (const event of DEMO_EVENTS) {
      await eventsRepository.createEvent({
        ...event,
        createdBy: admin.id
      });
    }
  }

  let customer = await authRepository.findUserByEmail(CUSTOMER_ACCOUNT.email);
  if (!customer) {
    const passwordHash = await bcrypt.hash(CUSTOMER_ACCOUNT.password, 10);
    customer = await authRepository.createUser({
      name: CUSTOMER_ACCOUNT.name,
      email: CUSTOMER_ACCOUNT.email,
      passwordHash,
      role: 'user'
    });
  }

  const demoEvents = await eventsRepository.listEvents();
  const seededRegistrations = await eventsRepository.listRegistrationsForUser(customer.id);
  if (seededRegistrations.length === 0) {
    for (const event of demoEvents.slice(0, 2)) {
      await eventsRepository.registerForEvent(event.id, customer.id);
    }
  }

  return {
    adminEmail: ADMIN_ACCOUNT.email,
    adminPassword: ADMIN_ACCOUNT.password,
    customerEmail: CUSTOMER_ACCOUNT.email,
    customerPassword: CUSTOMER_ACCOUNT.password,
    demoEventCount: DEMO_EVENTS.length
  };
}
