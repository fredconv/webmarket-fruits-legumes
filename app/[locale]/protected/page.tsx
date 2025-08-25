export default function ProtectedPage() {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
          <h3 className='text-xl font-semibold mb-2'>Member Dashboard</h3>
          <p className='text-muted-foreground'>
            Access your personal dashboard with exclusive features and data.
          </p>
        </div>

        <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
          <h3 className='text-xl font-semibold mb-2'>Premium Features</h3>
          <p className='text-muted-foreground'>
            Unlock premium features available only to registered members.
          </p>
        </div>

        <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
          <h3 className='text-xl font-semibold mb-2'>Member Support</h3>
          <p className='text-muted-foreground'>
            Get priority support and exclusive member resources.
          </p>
        </div>
      </div>

      <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
        <h2 className='text-2xl font-semibold mb-4'>Protected Content</h2>
        <p className='text-muted-foreground mb-4'>
          This is a members-only section of the website. Here you can access:
        </p>
        <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
          <li>Exclusive vendor deals and discounts</li>
          <li>Advanced search and filtering options</li>
          <li>Personal vendor favorites and recommendations</li>
          <li>Order history and tracking</li>
          <li>Member-only events and updates</li>
        </ul>
      </div>
    </div>
  );
}
