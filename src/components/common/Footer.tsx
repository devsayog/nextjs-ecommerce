import Link from 'next/link'

const footerData = {
  category: [
    { name: 'Men', href: '/men' },
    { name: 'Women', href: '/women' },
    { name: 'Kids', href: '/kids' },
    { name: 'New Arrivals', href: '/products/new-arrivals' },
  ],
  company: [
    { name: 'Who we are', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy', href: '#' },
  ],
  connect: [
    { name: 'Contact Us', href: '#' },
    { name: 'Twitter', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'Pinterest', href: '#' },
  ],
}
export function Footer() {
  return (
    <div className="w-full">
      <footer
        aria-labelledby="footer-heading"
        className="bg-gray-200 dark:bg-gray-900"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-sm px-4 sm:max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-10 py-10">
            <div className="flex-1 basis-[200px] ">
              <h3 className="font-medium">Cateory</h3>
              <ul role="list" className="mt-6 space-y-6">
                {footerData.category.map((item) => (
                  <li key={item.name} className="text-sm">
                    <Link
                      href={item.href}
                      className="text-blue-600 transition hover:text-blue-300 dark:text-blue-400 hover:dark:text-blue-700"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 basis-[200px]">
              <h3 className="font-medium">Company</h3>
              <ul role="list" className="mt-6 space-y-6">
                {footerData.company.map((item) => (
                  <li key={item.name} className="text-sm">
                    <a
                      href={item.href}
                      className="text-blue-600 transition hover:text-blue-300 dark:text-blue-400 hover:dark:text-blue-700"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 basis-[200px]">
              <h3 className="font-medium">Connect</h3>
              <ul role="list" className="mt-6 space-y-6">
                {footerData.connect.map((item) => (
                  <li key={item.name} className="text-sm">
                    <a
                      href={item.href}
                      className="text-blue-600 transition hover:text-blue-300 dark:text-blue-400 hover:dark:text-blue-700"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 py-10 dark:border-gray-700">
            <p className="text-center text-sm">
              Copyright &copy; {new Date().getFullYear()} Fashion Store.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
