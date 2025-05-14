# TSoft Side Plugin for Grispi

A Grispi plugin that integrates with TSoft e-commerce platform, allowing customer service agents to quickly lookup customers and their order history directly within the Grispi ticket interface.

## Features

- **Customer Search**: Search customers by name, email, phone number, or customer code
- **Automatic Detection**: Automatically search using the requester's phone number when available
- **Customer Details**: View comprehensive customer information including contact details
- **Order History**: Browse complete order history with status, totals, and dates
- **Order Details**: Access full order information including line items and shipping data

## Plugin Definitions

### Manifest

```json
{
  "title": "TSoft",
  "src": "https://grispi.app/tsoft-side-plugin/build/",
  "uiDefinition": {
    "height": 900
  },
  "singleton": false,
  "lazy": true
}
```

### Settings

```json
{}
```

## Installation

1. Clone this repository
2. Install dependencies:
   ```sh
   yarn install
   ```

## Development

### Running the Development Server

To test the application within Grispi, run:

```sh
yarn start
```

The application will be available at http://localhost:3000.

### Building for Production

```sh
yarn build
```

## API Integration

The plugin integrates with TSoft's API with the following main endpoints:

- **GET /customer/getCustomers**: Search for customers using various fields
- **GET /order/get**: Retrieve order details for a specific customer

The integration uses the token provided by the Grispi context for authentication.

## Code Structure

- `src/api/`: API integration with TSoft
- `src/components/`: Reusable UI components
- `src/contexts/`: Context providers for state management
- `src/screens/`: Main application screens
- `src/store/`: MobX stores for state management

## GrispiClient Instance Initialization

The `GrispiClient.instance()` initialization code is as follows:

```tsx
useEffect(() => {
  GrispiClient.instance()
    ._init()
    .then((data: GrispiBundle) => {
      setTicket(data.context.ticket);
      setSettings(data.settings);
      setLoading(false);

      GrispiClient.instance().activeTicketChanged = function (ticket: Ticket) {
        setTicket(ticket);
      };
    })
    .catch((err) => {
      console.error({ err });
    });
}, []);
```

### Testing Outside of Grispi

If you want to test outside of Grispi, make sure to comment out the `GrispiClient.instance()` block in the `contexts/grispi-context.tsx` file.

## Workflow

1. When a ticket is opened, the plugin automatically searches for the customer using the requester's phone number
2. Agents can also manually search for customers using the search form
3. Selecting a customer shows their details and order history
4. Clicking on an order displays the complete order details

## Technologies

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/UI](https://ui.shadcn.com/) - UI component library
- [MobX](https://mobx.js.org/) - State management
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications

## Sources

- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn](https://ui.shadcn.com/)
- [Craco](https://github.com/gsoft-inc/craco)
- [Create React App](https://github.com/facebook/create-react-app)
- [React documentation](https://reactjs.org/)
- [MobX Documentation](https://mobx.js.org/README.html)
