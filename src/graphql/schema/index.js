const { gql } = require('apollo-server-express');
const typeDefs = gql`
  scalar GraphQLDateTime
  scalar GraphQLDate

  type User {
    _id: ID
    role: String
    first_name: String
    last_name: String
    phone: String
    email: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
    notificationToken: String
    photo: String
    is_active: Boolean
  }

  type AuthData {
    _id: ID!
    token: String!
    tokenExpiration: GraphQLDateTime!
    role: String
    address: String
    phoneVerified: Boolean
    isEmailVerified: Boolean
    first_name: String
    last_name: String
    phone: String
    email: String
    notificationToken: String
    photo: String
    isOnline: Boolean
  }

  input Register {
    user: UserInput
    property: InputProperty
  }

  type ForgotPassword {
    result: Boolean!
  }

  type ForgotPasswordVerification {
    result: Boolean
    token: String
  }

  type Phone {
    phone: String!
    result: Boolean!
  }

  input UpdateUserInput {
    first_name: String
    last_name: String
    address: String
    photo: String
    notificationToken: String
  }

  input UserInput {
    photo: String
    address: String
    phone: String
    email: String
    password: String
    last_name: String
    first_name: String
    notificationToken: String
    role: String
    goals: [ID!]
  }

  input options {
    sortBy: String
    limit: Int
    page: Int
  }

  type UsersList {
    results: [User]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input userfilters {
    role: String
    first_name: String
    last_name: String
    phone: String
    email: String
    photo: String
    is_active: Boolean
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # Category type and inputs
  # =========================================================================

  type Category {
    _id: ID!
    name: String
    description: String
    image: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type CategoriesList {
    results: [Category]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputCategory {
    name: String
    description: String
    image: String
  }

  input DeleteCategoryInput {
    id: ID
  }

  input categoryfilters {
    name: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # goals type and inputs
  # =========================================================================

  type Goal {
    _id: ID!
    name: String
    description: String
    image: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type goalsList {
    results: [Goal]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputGoal {
    name: String
    description: String
    image: String
  }

  input DeleteGoalInput {
    id: ID
  }

  input goalfilters {
    name: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # PropertyType type and inputs
  # =========================================================================

  type PropertyType {
    _id: ID!
    name: String
    description: String
    image: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type propertyTypesList {
    results: [PropertyType]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputPropertyType {
    name: String
    description: String
    image: String
  }

  input DeletePropertyTypeInput {
    id: ID
  }

  input propertyTypefilters {
    name: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # Property type and inputs
  # =========================================================================

  type Property {
    _id: ID!
    name: String
    description: String
    images: [String]
    type: PropertyType
    bedrooms: Int
    bathrooms: Int
    owned_years: Int
    address: String
    city: String
    country: String
    zip_code: String
    is_active: Boolean
    added_by: User
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type propertiesList {
    results: [Property]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputProperty {
    name: String
    description: String
    images: [String]
    type: ID
    bedrooms: Int
    bathrooms: Int
    owned_years: Int
    address: String
    city: String
    country: String
    zip_code: String
    is_active: Boolean
    added_by: ID
  }

  input DeletePropertyInput {
    id: ID
  }

  input propertyfilters {
    type: ID
    name: String
    bedrooms: Int
    bathrooms: Int
    owned_years: Int
    city: String
    country: String
    zip_code: String
    is_active: Boolean
    added_by: ID
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # Inventory type and inputs
  # =========================================================================

  type Inventory {
    _id: ID!
    name: String
    description: String
    images: [String]
    type: Category
    brand: String
    model_no: String
    serail_no: String
    is_active: Boolean
    added_by: User
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type inventoriesList {
    results: [Inventory]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputInventory {
    name: String
    description: String
    images: [String]
    type: ID
    property: ID
    brand: String
    model_no: String
    serail_no: String
    is_active: Boolean
    added_by: ID
  }

  input DeleteInventoryInput {
    id: ID
  }

  input Inventoryfilters {
    name: String
    brand: String
    model_no: String
    serail_no: String
    is_active: Boolean
    type: ID
    added_by: ID
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # folder type and inputs
  # =========================================================================

  type Folder {
    _id: ID!
    name: String
    files: [File]
    inventory: Inventory
    added_by: User
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type FoldersList {
    results: [Folder]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputFolder {
    name: String
    files: [ID]
    inventory: ID
    added_by: ID
  }

  input DeleteFolderInput {
    id: ID
  }

  input Folderfilters {
    name: String
    inventory: ID
    added_by: ID
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # file type and inputs
  # =========================================================================

  type File {
    _id: ID!
    name: String
    path: String
    mimetype: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type FilesList {
    results: [File]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputFile {
    name: String
    path: String
    mimetype: String
  }

  input DeleteFileInput {
    id: ID
  }

  input Filefilters {
    name: String
    mimetype: String
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # Handyman type and inputs
  # =========================================================================

  type Handyman {
    _id: ID!
    occupation: String
    name: String
    contact_no: String
    property: Property
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type HandymenList {
    results: [Handyman]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputHandyman {
    occupation: String
    name: String
    contact_no: String
    property: ID
  }

  input DeleteHandymanInput {
    id: ID
  }

  input Handymanfilters {
    name: String
    occupation: String
    contact_no: String
    property: ID
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================
  # Task type and inputs
  # =========================================================================

  type Task {
    _id: ID!
    schedule_date: GraphQLDate
    inventory: Inventory
    description: String
    get_notifications: Boolean
    property: Property
    assign_to: Handyman
    added_by: User
    is_completed: Boolean
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  type TasksList {
    results: [Task]
    page: Int
    limit: Int
    totalPages: Int
    totalResults: Int
  }

  input InputTask {
    schedule_date: GraphQLDate
    property: ID
    inventory: ID
    added_by: ID
    description: String
    get_notifications: Boolean
    assign_to: ID
  }

  input DeleteTaskInput {
    id: ID
  }

  input Taskfilters {
    schedule_date: GraphQLDate
    is_completed: Boolean
    inventory: ID
    assign_to: ID
    added_by: ID
    createdAt: GraphQLDateTime
    updatedAt: GraphQLDateTime
  }

  # =========================================================================

  type InventoryGroupByCategory {
    _id: ID
    inventories: [Inventory]
    category: Category
  }

  type getImageKitToken {
    token: String
    expire: String
    signature: String
  }

  type Query {
    # getAllRiders: [User]
    # settings: [Setting]
    users(filters: userfilters, options: options): UsersList
    categories(filters: categoryfilters, options: options): CategoriesList!
    goals(filters: goalfilters, options: options): goalsList!
    propertyTypes(filters: propertyTypefilters, options: options): propertyTypesList!
    properties(filters: propertyfilters, options: options): propertiesList!
    inventories(filters: Inventoryfilters, options: options): inventoriesList!
    folders(filters: Folderfilters, options: options): FoldersList!
    files(filters: Filefilters, options: options): FilesList!
    handymen(filters: Handymanfilters, options: options): HandymenList!
    tasks(filters: Taskfilters, options: options): TasksList!
    monthlyTasksList(userId: ID!, month: String!): [Task]
    upcommingTasksList(filters: Taskfilters, options: options): TasksList!
    getInventoryByCategory(propertyId: ID!): [InventoryGroupByCategory]
    getImageKitToken: getImageKitToken
    # estates: [Estate]
    # customEstatesList: [Estate]
    # products: [Product]
    # allproducts: [Product]
    # orders: [Order]
    # transactions: [Transaction]
    # getTotlaTransactions: [Transaction]
    # getRiderOrders: [Order]
    # allOrders: [Order]
    # getRiderOrdersHiatory: [Order]
    # getRiderCurrentOrders: [Order]
    # completedOrders: [Order]
    profile: User
    # configuration: Configuration!
    # users(page: Int): [User!]
    # getUserByType(role: String): [User]
    # checkStripeId(id: String): Boolean!
    # getUserStripeCards(id: String): [stripeCardinfo]
  }

  type Mutation {
    login(email: String, password: String, notificationToken: String): AuthData!
    signup(userInput: UserInput): AuthData!
    registerWithProperty(userInput: UserInput, propertyInput: InputProperty): AuthData!

    sendPhoneCode(phone: String): Phone
    updateUser(updateUserInput: UpdateUserInput): User!
    forgotPassword(email: String!): ForgotPassword!
    forgetPasswordChange(token: String!, password: String!): ForgotPassword!
    forgotPasswordVerification(email: String!, code: String!): ForgotPasswordVerification!
    resetPassword(password: String!, newPassword: String!, email: String!): ForgotPassword!
    resendCode(phone: String): Phone
    verifyPhone(code: String, phone: String): Phone

    createCategory(inputCategory: InputCategory): Category
    deleteCategory(deleteCategoryInput: DeleteCategoryInput): Category
    updateCategory(id: ID!, updateCategoryInput: InputCategory): Category

    createGoal(inputGoal: InputGoal): Goal
    deleteGoal(deleteGoalInput: DeleteGoalInput): Goal
    updateGoal(id: ID!, updateGoalInput: InputGoal): Goal

    createPropertyType(inputPropertyType: InputPropertyType): PropertyType
    deletePropertyType(deletePropertyTypeInput: DeletePropertyTypeInput): PropertyType
    updatePropertyType(id: ID!, updatePropertyTypeInput: InputPropertyType): PropertyType

    createProperty(inputProperty: InputProperty): Property
    deleteProperty(deletePropertyInput: DeletePropertyInput): Property
    updateProperty(id: ID!, updatePropertyInput: InputProperty): Property

    addInventory(inputInventory: InputInventory): Inventory
    deleteInventory(deleteInventoryInput: DeleteInventoryInput): Inventory
    updateInventory(id: ID!, updateInventoryInput: InputInventory): Inventory

    addFolder(inputFolder: InputFolder): Folder
    deleteFolder(deleteFolderInput: DeleteFolderInput): Folder
    updateFolder(id: ID!, updateFolderInput: InputFolder): Folder

    addFile(folderId: ID!, inputFile: InputFile): File
    deleteFile(deleteFileInput: DeleteFileInput): File
    updateFile(id: ID!, updateFileInput: InputFile): File

    addHandyman(inputHandyman: InputHandyman): Handyman
    deleteHandyman(deleteHandymanInput: DeleteHandymanInput): Handyman
    updateHandyman(id: ID!, updateHandymanInput: InputHandyman): Handyman

    addTask(inputTask: InputTask): Task
    deleteTask(deleteTaskInput: DeleteTaskInput): Task
    updateTask(id: ID!, updateTaskInput: InputTask): Task

    # createSetting(settingInput: SettingInput): Setting
    # createTransaction(inputTransaction: InputTransaction): Transaction
    # deleteTransaction(deleteTransactionInput: DeleteTransactionInput): Transaction
    # placeOrder(inputOrder: InputOrder): Order
    # updateOrderStatus(updateOrderStatusInput: UpdateOrderStatusInput): Order
    # assignOrderToRider(assignOrderStatusInput: AssignOrderStatusInput): Order
    # createEstate(inputEstate: InputEstate): Estate
    # createCustomEstate(inputCustomEstate: InputCustomEstate): customEstate
    # editEstate(inputEditEstate: InputEditEstate): Estate
    # rateRider(inputRateRider: InputRateRider): Rate
    # createProduct(inputProduct: InputProduct): Product
    # editProduct(inputEditProduct: InputEditProduct): Product
    # deleteEstate(deleteEstateInput: DeleteEstateInput): Estate
    # deleteProduct(deleteProductInput: DeleteProductInput): Product
  }
`;
module.exports = typeDefs;
