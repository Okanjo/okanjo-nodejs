/**
 * Date: 5/28/14 1:17 PM
 *
 * SDK Constants
 *
 * ----
 *
 * (c) Okanjo Partners Inc
 * https://okanjo.com
 * support@okanjo.com
 *
 * https://github.com/okanjo/okanjo-nodejs
 *
 * ----
 *
 * TL,DR? see: http://www.tldrlegal.com/license/mit-license
 *
 * The MIT License (MIT)
 * Copyright (c) 2013 Okanjo Partners Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


function Constants() { }


Constants.addressStatus = {
    disabled: 0,
    active: 1
};


Constants.addressType = {
    billing: 'billing',
    shipping: 'shipping',
    cause: 'cause',
    payout: 'payout',
    store: 'store'
};


Constants.authLevel = {
    user: 1,
    admin: 2,
    guest: 4
};


Constants.bidFlag = {
    stoppingPoint: 1,
    maxBidUpdate: 2,
    counterAttempt: 4,
    instantOutbid: 8
};


Constants.bidStatus = {
    active: 0,
    revoked: 1
};


Constants.causeStatus = {
    disabled: 0,
    unconfirmed: 1,
    suggested: 2,
    confirmed: 3
};


Constants.loginAction = {
    loginUsernamePassword: 'loginUsernamePassword',
    loginEmailPassword: 'loginEmailPassword',
    loginFacebook: 'loginFacebook',

    registerEmailPassword: 'registerEmailPassword',
    registerFacebook: 'registerFacebook',

    guestCheckout: 'checkoutAsGuest'
};


Constants.mediaImageFormat = {
    desktop: 'desktop',
    mobileRetina: 'mobileRetina'
};


Constants.mediaImagePurpose = {
    product: 'product',
    userProfile: 'user_profile',
    storeBanner: 'store_banner',
    storeProfile: 'store_profile'
};


Constants.mediaImageSize = {
    original: 'original',
    listing: 'listing',
    listingFixed: 'listing_fixed',
    thumbnail: 'thumbnail',
    detail: 'detail',
    cart: 'cart',
    banner: 'banner',
    avatar: 'avatar',
    gallery: 'gallery'
};


Constants.messageContext = {
    seller: 'seller-to-buyer',
    buyer: 'buyer-to-seller'
};


Constants.notificationFlag = {
    read: 1,
    emailSent: 2
};


Constants.notificationType = {
    // Notification to buyer that the auction they were watching was cancelled.
    buyerAuctionCancelled: 'BuyerAuctionCancelled',
    // Notification to buyer that the auction they were watching has ended.
    buyerAuctionEnded: 'BuyerAuctionEnded',
    // Notification to buyer that the auction they are watching has started.
    buyerAuctionHasBegun: 'BuyerAuctionHasBegun',
    // Notification to buyer that they have been outbid on the given auction.
    buyerAuctionOutBid: 'BuyerAuctionOutBid',
    // Notification to buyer that they have won the auction they were bidding on.
    buyerAuctionWinner: 'BuyerAuctionWinner',
    // Notification to buyer that the seller marked the item they purchased as picked-up.
    buyerItemInsistedReceived: 'BuyerItemInsistedReceived',
    // Notification to buyer that they successfully a purchase.
    buyerItemPurchase: 'BuyerItemPurchase',
    // Notification to buyer that the item they bought has been marked as shipped by the seller.
    buyerItemShipped: 'BuyerItemShipped',
    // Notification to buyer that a forgotten password request was made on their user account.
    forgotPassword: 'ForgotPassword',
    // Notification to a user or store in regards to a product.
    privateMessageProduct: 'PrivateMessageProduct',
    // Notification to seller that their auction was cancelled.
    sellerAuctionCancelled: 'SellerAuctionCancelled',
    // Notification to seller that their auction was cancelled because it was bought-out.
    sellerAuctionCancelledBuyout: 'SellerAuctionCancelledBuyOut',
    // Notification to seller that their auction ended and no bids were made.
    sellerAuctionFailed: 'SellerAuctionFailed',
    // Notification to seller that their auction has started.
    sellerAuctionHasBegun: 'SellerAuctionHasBegun',
    // Notification to seller that their auction has ended and was won buy a bidder.
    sellerAuctionWon: 'SellerAuctionWon',
    // Notification to seller that a buyer left feedback on one of their sales.
    sellerFeedback: 'SellerFeedback',
    // Notification to seller that they Okanjo has released their funds for the sale of an item.
    sellerFundsDisbursed: 'SellerFundsDisbursed',
    // Notification to seller that they could not be paid.
    sellerFundsDisbursementFailed: 'SellerFundsDisbursementFailed',
    // Notification to seller that they have successfully listed an item for sale.
    sellerItemPosted: 'SellerItemPosted',
    // Notification to seller that they have sold an item.
    sellerItemPurchase: 'SellerItemPurchase',
    // Notification to seller that their subscription failed to be purchased or renewed.
    sellerSubscriptionBillingFailed: 'SellerSubscriptionBillingFailed',
    // Notification to seller that their subscription has been suspended due to non-payment.
    sellerSubscriptionDelinquent: 'SellerSubscriptionDelinquent',
    // Notification to seller that their subscription free-trial has begun.
    sellerSubscriptionFreeTrialStart: 'SellerSubscriptionFreeTrialStart',
    // Notification to seller that their subscription has been purchased or renewed.
    sellerSubscriptionInvoice: 'SellerSubscriptionInvoice',
    // Notification to seller that their subscription has begun.
    sellerSubscriptionStart: 'SellerSubscriptionStart',
    // Notification to seller that their subscription free-trial has ended.
    sellerSubscriptionTrialEnd: 'SellerSubscriptionTrialEnd',
    // Notification to a user welcoming them to the platform after signing up for a new account.
    welcome: 'Welcome'
};


Constants.orderStatus = {
    notSubmitted: 0,
    pendingPayment: 1,
    pendingFulfilment: 2,
    pendingAcquisition: 3,
    complete: 4,
    refunded: 5,
    voided: 6,
    expired: 7,
    pendingRedemption: 8,
    completeSellerInsistsItemReceived: 9,
    pendingRefund: 10,
    pendingDispute: 11
};


Constants.orderType = {
    physical: 1,
    donation: 2
};


Constants.payoutPreference = {
    bankAccount: 'balanced'
};


Constants.planStatus = {
    active: 1,
    disabled: 0
};


Constants.productCondition = {
    brandNew: 'New',
    used: 'Used',
    other: 'Other'
};


Constants.productStatus = {
    disabled: 0,
    active: 1,
    pending: 2,
    draft: 4,
    auctionEndedAwaitingPurchase: 5,
    auctionEndedPurchased: 6,
    permanentlyRemoved: 7,
    onVacation: 8,
    pendingActivation: 9
};


Constants.productStoreType = {
    owned: 1,
    inherited: 2
};


Constants.productType = {
    regular: 0,
    auction: 1,
    deal: 2,
    donation: 3
};


Constants.purchaseRequirements = {
    minOrderTotal: 0.50,
    maxOrderTotal: 10000,
    minItemPrice: 0.01,
    maxItemPrice: 9000,
    minShippingPrice: 0,
    maxShippingPrice: 1000,

    /** The max ratio of current bid to buy now price to allow buy now */
    maxAuctionBuyNowRatio: 0.15
};


Constants.regionStatus = {
    inactive: 0,
    active: 1
};


Constants.responseHeader = {
    collectionCount: 'X-COLLECTION-COUNT',
    servedBy: 'X-SERVED-BY'
};


Constants.shippingDescription = {
    localPickup: 'Local Pickup'
};


Constants.storeFlag = {
    isVendor: 1,
    storefrontEnabled: 2,
    storefrontEmbedEnabled: 4,
    homepagePromotionEnabled: 8
};


Constants.storeStatus = {
    disabled: 0,
    active: 1
};


Constants.storeType = {
    store: 1,
    cause: 2
};


Constants.subscriptionStatus = {
    trial: 0,
    created: 1,
    requirePayment: 2,
    pendingPayment: 3,
    active: 4,
    delinquent: 5,
    pendingCancellation: 6,
    cancelled: 7
};


Constants.transactionAssociation = {
    cause: 'cause',
    order: 'order',
    orderItem: 'order_item',
    store: 'store',
    user: 'user'
};


Constants.transactionStatus = {
    pending: 0,
    completed: 1
};


Constants.transactionType = {

    //
    // User/buyer types
    //

    buyerCreditPayment: 100, // funding the buyer account for an item purchase
    buyerDebitPurchase: 101, // send money to a store for a purchase
    buyerCreditRefundPurchase: 110, // refund of an item purchase (store gives the money back to the buyer)
    buyerDebitRefundPayment: 111, // refund of a payment (okanjo refunds the buyer's original payment)

    //
    // Store transaction types
    //

    storeCreditItemPayment: 200,  // store receives payment for the order
    storeDebitPaymentProcessingFee: 201, // payment vendor's fee for processing the transaction
    storeDebitOkanjoCommissionFee: 203, // okanjo's commission for facilitating the sale/donation of an item
    storeDebitDonation: 205,  // store's donation to the cause for the sale of the item
    storeCreditDonation: 206, // cause store donation income (linked to storeDebitDonation)
    storeDebitDonationOkanjoCommissionFee: 207, // functionally the same as storeDebitOkanjoCommissionFee but worded for causes

    storeDebitDisbursementFee: 221, // disbursement vendor's fee for processing the disbursement
    storeDebitDisbursement: 223, // the withdrawal of funds from okanjo to the store's external account

    // store subscription types
    storeCreditPayment: 230, // funding the store account for a subscription invoice
    storeDebitPurchase: 231, // purchase for a subscription renewal
    storeCreditRefundPurchase: 240, // refund of a subscription invoice
    storeDebitRefundPayment: 241, // refund of a payment (okanjo refunds the store's original payment)

    storeCreditReverseDisbursement: 250,  // reversal of a disbursement (e.g. reversal of a bank account deposit)
    storeCreditReverseDisbursementFailed: 252, // reversal of a disbursement (e.g. bank account routing / account number were wrong)
    storeCreditRefundDisbursementFee: 254, // refund of the disbursement fee collected by the disbursement vendor

    storeCreditRefundDonationOkanjoCommissionFee: 260, // functionally the same as storeCreditRefundOkanjoCommissionFee but for causes
    storeDebitRefundDonation: 261, // refund of a donation given to a cause back to the store
    storeCreditRefundDonation: 262, // refund to the store who made the donation to a cause
    storeCreditRefundOkanjoCommissionFee: 264, // refund from okanjo for the commission of a sale
    storeCreditRefundPaymentProcessingFee: 266, // refund of the payment fee collected by the payment processing vendor
    storeDebitRefundItemPayment: 267, // refund of the purchase of an item to a buyer


    //
    // Organization / Marketplace types
    //

    orgCreditSaleCommission: 300, // commission for a sale
    orgDebitRefundSaleCommission: 301, // refund of a commission for a sale
    orgCreditDonationCommission: 310, // commission for a donation
    orgDebitRefundDonationCommission: 311, // refund of a donation commission
    orgCreditSubscriptionCommission: 320, // commission for a subscription invoice
    orgDebitRefundSubscriptionCommission: 321, // refund of a subscription invoice commission
    orgDebitRefundedPaymentFee: 331, // loss for a refunded payment fee
    orgDebitReversedDisbursementFee: 333, // loss for a reversed disbursement fee
    orgCreditOther: 340, // miscellaneous credit
    orgDebitOther: 341 // miscellaneous debit
};


Constants.vanityUriType = {
    store: 'store',
    cause: 'cause',
    category: 'category'
};

module.exports = exports = Constants;