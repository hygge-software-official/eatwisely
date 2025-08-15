import React from 'react';

import { SignedIn, SignedOut } from '@clerk/clerk-expo';
import ProfileAuthenticated from '@/screens/profile/profileAuthenticated';
import ProfileUnauthenticated from '@/screens/profile/profileUnauthenticated';

export default function ProfilePage() {
  return (
    <>
      <SignedIn>
        <ProfileAuthenticated />
      </SignedIn>
      <SignedOut>
        <ProfileUnauthenticated />
      </SignedOut>
    </>
  );
}
