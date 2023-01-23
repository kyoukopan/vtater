import React, { useCallback, useState } from "react";

import { Card, Col, Container, Row } from "@nextui-org/react";
import BrandHeader from "@/components/lib/BrandHeader";
import AuthWrapper from "@/components/Auth/AuthWrapper";
import Text from "@/components/lib/Text";
import Input from "@/components/lib/Input";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import NavbarWrapper from "@/components/NavbarWrapper";

export default function Profile() {
  const [user] = useAuthState(auth);
  return (
    <AuthWrapper>
      <NavbarWrapper>
        <Container xs as="main" className="mt-32">
          <BrandHeader />
          <Card variant="bordered" className="my-8 space-y-4 py-8 px-8">
            <Text h3 className="mb-4">
              Profile
            </Text>
            <Row>
              <Col span={4}>
                <Text weight="semibold">email</Text>
              </Col>
              <Col>
                <Text>{user?.email}</Text>
              </Col>
            </Row>
          </Card>
        </Container>
      </NavbarWrapper>
    </AuthWrapper>
  );
}
